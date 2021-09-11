import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql';
import bcrypt from 'bcryptjs';
import { JwtPayload } from 'jsonwebtoken';
// Types
import { UserType } from '../Types/UserType';
import { IUser, IContext, IMySQLQuery } from '../../Interfaces';
// Helpers
import checkAuth from '../../Helpers/CheckAuth';
import validateUser from '../../Helpers/AddUserValidation';
import { mysqlQuery } from '../../Helpers/MySQLPromise';
import { generateToken } from '../../Helpers/GenerateToken';

type Args = {
    username: string,
    password: string,
    confirmPassword: string,
    email: string,
    country: string,
    city: string,
    birthDate: string
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
    async resolve(_: any, args: Args, context: IContext) {
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

            const getUserQuery = `
                SELECT
                    user_id AS id,
                    user_username AS username
                    FROM users 
                    WHERE user_id = ${queryResult.insertId}
            `;
            const user: IUser[] = await mysqlQuery(getUserQuery, context.connection);

            // Initial user image
            const insertUserImageQuery = `INSERT INTO images(
                image_type,
                image_user_id,
                image_image
            ) VALUES (
                "U",
                ${user[0].id},
                null
            )`;
            await mysqlQuery(insertUserImageQuery, context.connection)

            // Initial profile
            const insertProfileQuery = `INSERT INTO profiles(
                profile_user_id,
                profile_profile_name
            ) VALUES (
                ${user[0].id},
                "${user[0].username}"
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
                id: user[0].id,
                username: user[0].username,
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
    async resolve(_: any, args: Pick<Args, "username" | "password">, context: IContext) {
        const { username, password } = args

        const getUserQuery = `
            SELECT
                user_id AS id,
                user_username AS username,
                user_password AS password
                FROM users 
                WHERE user_username = "${username}"`;
        const response: IUser[] = await mysqlQuery(getUserQuery, context.connection);
        const user = response[0];

        if (!user) throw new Error('User not found');
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error('Wrong username or password');

        const token = generateToken(user);

        return {
            id: user.id,
            username: user.username,
            token
        }
    }
};

export const DELETE_USER = {
    name: 'DELETE_USER',
    type: GraphQLString,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: { id: string }, context: IContext) {
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