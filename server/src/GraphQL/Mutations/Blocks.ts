import { GraphQLID, GraphQLNonNull } from "graphql";
import { mysqlQuery } from "../../Helpers/MySQLPromise";
import { IBlockUser, IContext } from "../../Interfaces";
import { BlockStatusType } from "../Types/BlockStatusType";

export const BLOCK_USER = {
    name: 'BLOCK_USER',
    type: BlockStatusType,
    args: {
        blockingUserId: { type: new GraphQLNonNull(GraphQLID) },
        blockedUserId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: IBlockUser, context: IContext) {
        const { blockingUserId, blockedUserId } = args;
        try {
            const checkRelationQuery = `SELECT * FROM blocks WHERE blocking_user_id = ${blockingUserId} AND blocked_user_id = ${blockedUserId}`;
            const response: IBlockUser[] = await mysqlQuery(checkRelationQuery, context.connection);

            const query = response[0] ?
                `DELETE FROM blocks WHERE blocking_user_id = ${blockingUserId} AND blocked_user_id = ${blockedUserId}` :
                `INSERT INTO blocks (blocking_user_id, blocked_user_id) VALUES (${blockingUserId}, ${blockedUserId}) `
                ;

            await mysqlQuery(query, context.connection);

            return { blocked: response[0] ? false : true }
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};