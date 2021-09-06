import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import checkAuth from '../../Helpers/CheckAuth';
import User from '../../Models/User';
import { UserType } from '../Types/UserType';
import { IAddUser, IEditUserImage, IFollowUser, ILoginUser, IUser, IContext, IBlockUser, IDeleteUser, IMySQLQuery } from '../../Interfaces';
import validateUser from '../../Helpers/AddUserValidation';
import { mysqlQuery } from '../../Helpers/MySQLPromise';

function generateToken(user: IUser) {
    return jwt.sign({
        id: user.user_id,
        email: user.user_email,
        username: user.user_username,
        country: user.user_country,
        city: user.user_city,
        birthDate: user.user_birth_date,
        followers: user.user_followers ? user.user_followers : [],
        following: user.user_following ? user.user_following : [],
        blockedUsers: user.user_blocked_users ? user.user_blocked_users : []
    }, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' })
};

export const ADD_USER = {
    name: 'ADD_USER',
    type: UserType,
    args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        confirmPassword: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        country: { type: new GraphQLNonNull(GraphQLString) },
        city: { type: new GraphQLNonNull(GraphQLString) },
        birthDate: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_: any, args: IAddUser, context: IContext) {
        const { username, password, confirmPassword, email, country, city, birthDate } = args;

        validateUser(username, password);

        try {
            if (password !== confirmPassword) throw new Error("Passwords don't match");
            const hash = await bcrypt.hash(password, 10);
            const insertUserQuery = `INSERT INTO users (
                user_username,
                user_email,
                user_password,
                user_city,
                user_country,
                user_birth_date
            ) VALUES (
                "${username}",
                "${email}",
                "${hash}",
                "${city}",
                "${country}",
                "${birthDate}"
            )`;

            const queryResult: IMySQLQuery = await mysqlQuery(insertUserQuery, context.connection);
            const user: IUser[] = await mysqlQuery(`SELECT * FROM users WHERE user_id = ${queryResult.insertId}`, context.connection);

            const insertProfileQuery = `INSERT INTO profiles(
                profile_user_id,
                profile_profile_name
            ) VALUES (
                ${user[0].user_id},
                "${user[0].user_username}"
            )`;

            await mysqlQuery(insertProfileQuery, context.connection);
            const token = generateToken(user[0]);

            return {
                username: user[0].user_username,
                email: user[0].user_email,
                country: user[0].user_country,
                city: user[0].user_city,
                birthDate: user[0].user_birth_date,
                followers: [],
                following: [],
                blockedUsers: [],
                token
            }
        }
        catch (err: any) {
            if (err.sqlMessage.startsWith('Duplicate entry')) {
                if (/users.user_username/.test(err.sqlMessage)) throw new Error("Username already registered");
                if (/users.user_email/.test(err.sqlMessage)) throw new Error("Email already registered");
            }
            throw new Error(err)
        }
    }
};

// export const LOGIN_USER = {
//     name: 'LOGIN_USER',
//     type: UserType,
//     args: {
//         username: { type: new GraphQLNonNull(GraphQLString) },
//         password: { type: new GraphQLNonNull(GraphQLString) },
//     },
//     async resolve(_: any, args: ILoginUser) {

// const getFollowersQuery = `
//     SELECT user_username, user_id FROM users
//     JOIN follows
//     ON follows.follower_id = users.user_id
//     WHERE follows.followee_id = ""
// `;
//         const { username, password } = args
//         const user: IUser = await User.findOne({ username })

//         if (!user) throw new Error('User not found');

//         const match = await bcrypt.compare(password, user.password);
//         if (!match) throw new Error('Wrong username or password');

//         const token = generateToken(user)
//         return {
//             id: user._id,
//             username: user.username,
//             email: user.email,
//             createdAt: user.createdAt,
//             token,
//             country: user.country,
//             city: user.city,
//             birthDate: user.birthDate,
//             followers: user.followers,
//             following: user.following,
//             blockedUsers: user.blockedUsers
//         }
//     }
// };

// export const EDIT_USER_IMAGE = {
//     name: 'EDIT_USER_IMAGE',
//     type: UserType,
//     args: {
//         image: { type: GraphQLString }
//     },
//     async resolve(_: any, args: IEditUserImage, context: IContext) {
//         const user = checkAuth(context) as JwtPayload;

//         const userToEdit: IUser = await User.findOne({ username: user.username });
//         if (!userToEdit) throw new Error('User not found');

//         const newUser = await User.findOneAndUpdate({ username: user.username }, {
//             image: args.image
//         }, { new: true });

//         return newUser
//     }
// };

// export const FOLLOW_USER = {
//     name: 'FOLLOW_USER',
//     type: UserType,
//     args: {
//         followingUsername: { type: new GraphQLNonNull(GraphQLString) },
//         followedUsername: { type: new GraphQLNonNull(GraphQLString) }
//     },
//     async resolve(_: any, args: IFollowUser) {
//         const { followingUsername, followedUsername } = args;
//         try {
//             const followingUser: IUser = await User.findOne({ username: followingUsername });
//             const followedUser: IUser = await User.findOne({ username: followedUsername });

//             if (!followedUser) throw new Error('User not found');

//             const alreadyFollows = followedUser.followers.find(f => f.username === followingUser.username);

//             if (alreadyFollows) {
//                 const newFollowingUser = await User.findOneAndUpdate({ username: followingUsername }, {
//                     following: followingUser.following.filter(f => f.username !== followedUsername)
//                 }, { new: true });

//                 await User.findOneAndUpdate({ username: followedUsername }, {
//                     followers: followingUser.followers.filter(f => f.username !== followingUsername)
//                 }, { new: true });

//                 return newFollowingUser
//             };

//             if (!alreadyFollows) {
//                 const newFollowingUser = await User.findOneAndUpdate({ username: followingUsername }, {
//                     following: [...followingUser.following, { username: followedUsername }]
//                 }, { new: true });

//                 await User.findOneAndUpdate({ username: followedUsername }, {
//                     followers: [...followedUser.followers, { username: followingUsername }]
//                 }, { new: true });

//                 return newFollowingUser
//             };
//         }
//         catch (err: any) {
//             throw new Error(err)
//         }
//     }
// };

// export const BLOCK_USER = {
//     name: 'BLOCK_USER',
//     type: UserType,
//     args: {
//         blockedUsername: { type: new GraphQLNonNull(GraphQLString) }
//     },
//     async resolve(_: any, args: IBlockUser, context: IContext) {
//         const user = checkAuth(context) as JwtPayload;

//         const { blockedUsername } = args;
//         try {
//             const blockingUser: IUser = await User.findOne({ username: user.username })
//             const blockedUser: IUser = await User.findOne({ username: blockedUsername });

//             if (!blockedUser) throw new Error('User not found');

//             const alreadyBlocked = blockingUser.blockedUsers.find((user: IUser) => user.username === blockedUsername);

//             if (alreadyBlocked) {
//                 const newUser = await User.findOneAndUpdate({ username: blockingUser.username }, {
//                     blockedUsers: blockingUser.blockedUsers.filter(u => u.username !== blockedUsername),
//                 }, { new: true });
//                 return newUser
//             };

//             if (!alreadyBlocked) {
//                 const newUser = await User.findOneAndUpdate({ username: blockingUser.username }, {
//                     blockedUsers: [...blockingUser.blockedUsers, { username: blockedUsername }],
//                     followers: blockingUser.followers.filter(f => f.username !== blockedUsername)
//                 }, { new: true });

//                 await User.findOneAndUpdate({ username: blockedUser.username }, {
//                     following: blockedUser.following.filter(f => f.username !== blockingUser.username)
//                 }, { new: true });

//                 return newUser
//             };
//         }
//         catch (err: any) {
//             throw new Error(err)
//         }
//     }
// };

export const DELETE_USER = {
    name: 'DELETE_USER',
    type: GraphQLString,
    args: {
        id: { type: new GraphQLNonNull(GraphQLInt) }
    },
    async resolve(_: any, args: IDeleteUser, context: IContext) {
        const user = checkAuth(context) as JwtPayload;
        if(args.id !== user.id) throw new Error("Action not allowed");

        try {
            const deleteUserQuery = `DELETE FROM users WHERE user_id = ${args.id}`;
            await mysqlQuery(deleteUserQuery, context.connection);
            return "User deleted"
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};