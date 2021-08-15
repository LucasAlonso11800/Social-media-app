import { GraphQLNonNull, GraphQLString } from 'graphql';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../Models/User';
import { UserType } from '../Types/UserType';
import { IAddUser, ILoginUser, IUser } from '../../Interfaces';

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
            const res = await User.insertMany(newUser)
            const token = generateToken(res[0])

            return {
                id: res[0]._id,
                username: res[0].username,
                email: res[0].email,
                createdAt: res[0].createdAt,
                token
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
        const user = await User.findOne({ username })

        if (!user) throw new Error('User not found');

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error('Wrong username or password');

        const token = generateToken(user)
        return {
            id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            token
        }
    }
};