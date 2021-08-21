import { GraphQLNonNull, GraphQLString } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import checkAuth from '../../Helpers/CheckAuth';
import User from '../../Models/User';
import { UserType } from '../Types/UserType';
import { IAddUser, IEditUserImage, IFollowUser, ILoginUser, IUser, IContext } from '../../Interfaces';

function generateToken(user: IUser) {
    return jwt.sign({
        id: user._id,
        email: user.email,
        username: user.username,
    }, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' })
};

export const ADD_USER = {
    name: 'ADD_USER',
    type: UserType,
    args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        confirmPassword: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_: any, args: IAddUser) {
        const { username, password, confirmPassword, email } = args
        try {
            if (password !== confirmPassword) throw new Error("Passwords don't match")

            const usernameExists = await User.findOne({ username });
            if (usernameExists) throw new Error('Username already taken');

            const emailExists = await User.findOne({ email });
            if (emailExists) throw new Error('Email already registered');

            const newUser = new User({
                username,
                password,
                email,
                createdAt: new Date().toISOString()
            })
            newUser.password = await bcrypt.hash(password, 10);
            const res: IUser[] = await User.insertMany(newUser)
            const token = generateToken(res[0])

            return {
                id: res[0]._id,
                username: res[0].username,
                email: res[0].email,
                createdAt: res[0].createdAt,
                token,
                followers: res[0].followers,
                following: res[0].following
            }
        }
        catch (err) {
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
    async resolve(_: any, args: ILoginUser) {
        const { username, password } = args
        const user: IUser = await User.findOne({ username })

        if (!user) throw new Error('User not found');

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error('Wrong username or password');

        const token = generateToken(user)
        return {
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            token,
            followers: user.followers,
            following: user.following
        }
    }
};

export const EDIT_USER_IMAGE = {
    name: 'EDIT_USER_IMAGE',
    type: UserType,
    args: {
        image: { type: GraphQLString }
    },
    async resolve(_: any, args: IEditUserImage, context: IContext) {
        const user = checkAuth(context) as JwtPayload;

        const userToEdit: IUser = await User.findOne({ username: user.username });
        if (!userToEdit) throw new Error('User not found');

        const newUser = await User.findOneAndUpdate({ username: user.username }, {
            image: args.image
        }, { new: true });

        return newUser
    }
};

export const FOLLOW_USER = {
    name: 'FOLLOW_USER',
    type: UserType,
    args: {
        followingUsername: { type: new GraphQLNonNull(GraphQLString) },
        followedUsername: { type: new GraphQLNonNull(GraphQLString) },
        followingImage: { type: GraphQLString },
        followedImage: { type: GraphQLString },
    },
    async resolve(_: any, args: IFollowUser) {
        const { followingUsername, followedUsername, followingImage, followedImage } = args;
        try {
            const followingUser: IUser = await User.findOne({ username: followingUsername });
            const followedUser: IUser = await User.findOne({ username: followedUsername });

            if (!followedUser) throw new Error('User not found');

            const alreadyFollows = followedUser.followers.find(f => f.username === followingUser.username);

            if (alreadyFollows) {
                const newFollowingUser = await User.findOneAndUpdate({ username: followingUsername }, {
                    following: followingUser.following.filter(f => f.username !== followedUsername)
                }, { new: true });

                await User.findOneAndUpdate({ username: followedUsername }, {
                    followers: followingUser.followers.filter(f => f.username !== followingUsername)
                }, { new: true });

                return newFollowingUser
            };

            if (!alreadyFollows) {
                const newFollowingUser = await User.findOneAndUpdate({ username: followingUsername }, {
                    following: [...followingUser.following, {
                        username: followedUsername,
                        image: followedImage
                    }]
                }, { new: true });

                await User.findOneAndUpdate({ username: followedUsername }, {
                    followers: [...followedUser.followers, {
                        username: followingUsername,
                        image: followingImage
                    }]
                }, { new: true });

                return newFollowingUser
            };
        }
        catch (err) {
            throw new Error(err)
        }
    }
};