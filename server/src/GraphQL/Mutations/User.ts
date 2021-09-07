import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import checkAuth from '../../Helpers/CheckAuth';
import User from '../../Models/User';
import { UserType } from '../Types/UserType';
import { IAddUser, IEditUserImage, IFollowUser, ILoginUser, IUser, IContext, IBlockUser, IDeleteUser, IMySQLQuery, IFollower, IBlocked } from '../../Interfaces';
import validateUser from '../../Helpers/AddUserValidation';
import { mysqlQuery } from '../../Helpers/MySQLPromise';
import { FollowerType } from '../Types/FollowerType';
import { BlockedType } from '../Types/BlockedType';

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

export const LOGIN_USER = {
    name: 'LOGIN_USER',
    type: UserType,
    args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(_: any, args: ILoginUser, context: IContext) {
        const { username, password } = args

        const getUserQuery = `SELECT * FROM users WHERE user_username = "${username}"`;
        const response: IUser[] = await mysqlQuery(getUserQuery, context.connection);
        const user = response[0];

        if (!user) throw new Error('User not found');
        const match = await bcrypt.compare(password, user.user_password);
        if (!match) throw new Error('Wrong username or password');

        const getFollowersQuery = `
            SELECT user_id AS id, user_username AS username FROM follows
            JOIN users ON users.user_id = follower_id
            WHERE followee_id = ${user.user_id}
        `;
        const getFollowingQuery = `
            SELECT user_id AS id, user_username AS username FROM follows
            JOIN users ON users.user_id = followee_id
            WHERE follower_id = ${user.user_id}
        `;
        const getBlockedUsersQuery = `
            SELECT user_id AS id, user_username AS username FROM blocks
            JOIN users ON users.user_id = blocked_user_id
            WHERE blocking_user_id =  ${user.user_id}
        `;

        const followers = await mysqlQuery(getFollowersQuery, context.connection);
        const following = await mysqlQuery(getFollowingQuery, context.connection);
        const blockedUsers = await mysqlQuery(getBlockedUsersQuery, context.connection);

        const token = generateToken(user);

        return {
            id: user.user_id,
            username: user.user_username,
            email: user.user_email,
            token,
            country: user.user_country,
            city: user.user_city,
            birthDate: user.user_birth_date,
            followers,
            following,
            blockedUsers
        }
    }
};

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

export const DELETE_USER = {
    name: 'DELETE_USER',
    type: GraphQLString,
    args: {
        id: { type: new GraphQLNonNull(GraphQLInt) }
    },
    async resolve(_: any, args: IDeleteUser, context: IContext) {
        const user = checkAuth(context) as JwtPayload;
        if (args.id !== user.id) throw new Error("Action not allowed");

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