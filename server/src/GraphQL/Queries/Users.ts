import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { mysqlQuery } from '../../Helpers/MySQLPromise';
import { IContext, IGetUsersBySearch } from '../../Interfaces';
import { UserType } from '../Types/UserType';

export const GET_USERS_BY_SEARCH = {
    type: GraphQLList(UserType),
    args: {
        query: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_: any, args: IGetUsersBySearch, context: IContext) {
        try {
            const getUsersBySearchQuery = `
                SELECT
                    user_id AS id,
                    user_username AS username, 
                    user_country AS country,
                    user_city AS city,
                    user_birth_date AS birthDate,    
                    profile_profile_name AS profileName
                    FROM users
                    JOIN profiles
                    ON profiles.profile_user_id = user_id
                    WHERE user_username LIKE "%${args.query}%"
            `;
            return await mysqlQuery(getUsersBySearchQuery, context.connection);
        }
        catch (err: any) {
            throw new Error(err);
        }
    }
};