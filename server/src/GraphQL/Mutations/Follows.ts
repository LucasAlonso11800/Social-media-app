import { GraphQLID, GraphQLNonNull } from "graphql";
// Helpers
import { mysqlQuery } from "../../Helpers/MySQLPromise";
// Types
import { FollowStatusType } from "../Types/FollowStatusType";
import { IContext, IFollowRelation } from "../../Interfaces";

type Args = {
    followerId: string,
    followeeId: string
};

export const FOLLOW_USER = {
    name: 'FOLLOW_USER',
    type: FollowStatusType,
    args: {
        followerId: { type: new GraphQLNonNull(GraphQLID) },
        followeeId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: Args, context: IContext) {
        const { followerId, followeeId } = args;

        try {
            const checkRelationQuery = `SELECT * FROM follows WHERE follower_id = ${followerId} AND followee_id = ${followeeId}`;
            const response: IFollowRelation[] = await mysqlQuery(checkRelationQuery, context.connection);
            const query = response[0] ?
                `DELETE FROM follows WHERE follower_id = ${followerId} AND followee_id =  ${followeeId}` :
                `INSERT INTO follows (follower_id, followee_id) VALUES (${followerId}, ${followeeId}) `
                ;
            await mysqlQuery(query, context.connection);

            const getFollowersListQuery = `SELECT * FROM follows WHERE followee_id = ${followeeId}`;
            const getFolloweeListQuery = `SELECT * FROM follows WHERE follower_id = ${followeeId}`;

            
            const followerList: IFollowRelation[] = await mysqlQuery(getFollowersListQuery, context.connection);
            const followeeList: IFollowRelation[] = await mysqlQuery(getFolloweeListQuery, context.connection);

            return {
                follows: response[0] ? false : true,
                followerCount: followerList.length,
                followeeCount: followeeList.length
            }
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};