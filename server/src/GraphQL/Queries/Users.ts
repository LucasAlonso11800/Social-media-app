import { GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID } from 'graphql';
// Helpers
import { mysqlQuery } from '../../Helpers/MySQLPromise';
// Types
import { UserFollowCountType } from '../Types/UserFollowCountType';
import { UserType } from '../Types/UserType';
import { IContext } from '../../Interfaces';

export const GET_USERS_BY_SEARCH = {
    type: GraphQLList(UserType),
    args: {
        query: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_: any, args: { query: string }, context: IContext) {
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
            return await mysqlQuery(getUsersBySearchQuery);
        }
        catch (err: any) {
            throw new Error(err);
        }
    }
};