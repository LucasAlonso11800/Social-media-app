import { GraphQLNonNull, GraphQLID, GraphQLList } from 'graphql';
// Helpers
import { mysqlQuery } from '../../Helpers/MySQLPromise';
// Types
import { FollowerType } from '../Types/FollowerType';
import { FollowStatusType } from '../Types/FollowStatusType';
import { IContext, IFollowRelation } from '../../Interfaces';

type Args = {
    followerId: string,
    followeeId: string
};

export const GET_FOLLOW_STATUS = {
    type: FollowStatusType,
    args: {
        followerId: { type: GraphQLID },
        followeeId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: Args, context: IContext) {
        const { followerId, followeeId } = args;
        
        try {
            const getFollowerListQuery = `SELECT * FROM follows WHERE followee_id = ${followeeId}`;
            const getFolloweeListQuery = `SELECT * FROM follows WHERE follower_id = ${followeeId}`;

            const followerList: IFollowRelation[] = await mysqlQuery(getFollowerListQuery);
            const followeeList: IFollowRelation[] = await mysqlQuery(getFolloweeListQuery);

            const userHasFollowed = followerList.find(follow => follow.follower_id.toString() === followerId);
            return {
                follows: userHasFollowed ? true : false,
                followerCount: followerList.length,
                followeeCount: followeeList.length
            }
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};

export const GET_FOLLOW_LIST = {
    type: GraphQLList(FollowerType),
    args: {
        followeeId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: Pick<Args, "followeeId">, context: IContext) {
        const { followeeId } = args;

        try {
            const getFollowsListQuery =
                `SELECT 
                    follower_id AS id,
                    user_username AS username
                    FROM follows 
                    JOIN users
                    ON users.user_id = follower_id
                    WHERE followee_id = ${followeeId}
                `;

            return await mysqlQuery(getFollowsListQuery)
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};