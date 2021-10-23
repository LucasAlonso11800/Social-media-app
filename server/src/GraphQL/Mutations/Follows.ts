import { GraphQLID, GraphQLNonNull } from "graphql";
// Helpers
import { mysqlQuery } from "../../Helpers/MySQLPromise";
// Types
import { FollowStatusType } from "../Types/FollowStatusType";
import { IContext, IMySQLQuery } from "../../Interfaces";

type Args = {
    followerId: string,
    followeeId: string
};

type MySQLResponse = [
    [{
        followers: number,
        followees: number
    }],
    IMySQLQuery
];

export const FOLLOW_USER = {
    name: 'FOLLOW_USER',
    type: FollowStatusType,
    args: {
        followerId: { type: new GraphQLNonNull(GraphQLID) },
        followeeId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: Args) {
        const { followerId, followeeId } = args;

        try {
            const checkRelationQuery = `CALL CheckFollowRelation(${followerId}, ${followeeId})`;
            const response: MySQLResponse = await mysqlQuery(checkRelationQuery);

            const query = response[0][0] ?
                `CALL FollowDel(${followerId}, ${followeeId})` :
                `CALL FollowIns (${followerId}, ${followeeId}) `
                ;

            await mysqlQuery(query);

            const followerList: MySQLResponse = await mysqlQuery(`CALL FollowersCountGet(${followeeId})`);
            const followeeList: MySQLResponse = await mysqlQuery(`CALL FolloweesCountGet(${followeeId})`);

            return {
                follows: response[0][0] ? false : true,
                followerCount: followerList[0][0].followers,
                followeeCount: followeeList[0][0].followees
            }
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};