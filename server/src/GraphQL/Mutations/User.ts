import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import bcrypt from 'bcryptjs';
import { JwtPayload } from 'jsonwebtoken';
import checkAuth from '../../Helpers/CheckAuth';
import { UserType } from '../Types/UserType';
import { IAddUser, ILoginUser, IUser, IContext, IDeleteUser, IMySQLQuery } from '../../Interfaces';
import validateUser from '../../Helpers/AddUserValidation';
import { mysqlQuery } from '../../Helpers/MySQLPromise';
import { generateToken } from '../../Helpers/GenerateToken';

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
            
            // Initial user image
            const insertUserImageQuery = `INSERT INTO images(
                image_type,
                image_user_id,
                image_image
            ) VALUES (
                "U",
                ${user[0].user_id},
                null
            )`;
            await mysqlQuery(insertUserImageQuery, context.connection)

            // Initial profile
            const insertProfileQuery = `INSERT INTO profiles(
                profile_user_id,
                profile_profile_name
            ) VALUES (
                ${user[0].user_id},
                "${user[0].user_username}"
            )`;
            const profileQueryResult: IMySQLQuery = await mysqlQuery(insertProfileQuery, context.connection);
            
            // Initial profile image
            const insertProfileImageQuery = `INSERT INTO images(
                image_type,
                image_profile_id,
                image_image
            ) VALUES (
                "P",
                ${profileQueryResult.insertId},
                null
            )`;
            await mysqlQuery(insertProfileImageQuery, context.connection);

            const token = generateToken(user[0]);

            return {
                id: user[0].user_id,
                username: user[0].user_username,
                token
            }
        }
        catch (err: any) {
            if (err.sqlMessage && err.sqlMessage.startsWith('Duplicate entry')) {
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

        const token = generateToken(user);

        return {
            id: user.user_id,
            username: user.user_username,
            token
        }
    }
};

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