import { GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID } from 'graphql';
import { mysqlQuery } from '../../Helpers/MySQLPromise';
import { IContext, IGetUserFollowCount, IGetUsersBySearch } from '../../Interfaces';
import { UserFollowCountType } from '../Types/UserFollowCountType';
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

export const GET_USER_FOLLOW_COUNT = {
    type: UserFollowCountType,
    args: {
        userId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: IGetUserFollowCount, context: IContext) {
        const { userId } = args;

        try {
            const getFollowerCountQuery = `SELECT COUNT(*) AS followers FROM follows WHERE followee_id = ${userId}`;
            const followerCount = await mysqlQuery(getFollowerCountQuery, context.connection);

            const getFollowingCountQuery = `SELECT COUNT(*) AS following FROM follows WHERE follower_id = ${userId}`;
            const followingCount = await mysqlQuery(getFollowingCountQuery, context.connection);

            return {
                followerCount: followerCount[0].followers,
                followingCount: followingCount[0].following
            }
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};