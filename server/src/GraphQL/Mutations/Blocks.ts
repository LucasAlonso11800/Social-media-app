import { GraphQLID, GraphQLNonNull } from "graphql";
// Helpers
import { mysqlQuery } from "../../Helpers/MySQLPromise";
// Types
import { BlockStatusType } from "../Types/BlockStatusType";
import { IBlockRelation, IContext } from "../../Interfaces";

type Args = {
    blockingUserId: string,
    blockedUserId: string
};

export const BLOCK_USER = {
    name: 'BLOCK_USER',
    type: BlockStatusType,
    args: {
        blockingUserId: { type: new GraphQLNonNull(GraphQLID) },
        blockedUserId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: Args, context: IContext) {
        const { blockingUserId, blockedUserId } = args;
        try {
            const checkRelationQuery = `SELECT * FROM blocks WHERE blocking_user_id = ${blockingUserId} AND blocked_user_id = ${blockedUserId}`;
            const response: IBlockRelation[] = await mysqlQuery(checkRelationQuery);

            const query = response[0] ?
                `DELETE FROM blocks WHERE blocking_user_id = ${blockingUserId} AND blocked_user_id = ${blockedUserId}` :
                `INSERT INTO blocks (blocking_user_id, blocked_user_id) VALUES (${blockingUserId}, ${blockedUserId}) `
                ;

            await mysqlQuery(query);

            return { isBlocking: response[0] ? false : true }
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};