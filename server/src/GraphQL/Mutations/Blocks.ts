import { GraphQLID, GraphQLNonNull } from "graphql";
// Helpers
import { mysqlQuery } from "../../Helpers/MySQLPromise";
// Types
import { BlockStatusType } from "../Types/BlockStatusType";
import { IBlockRelation, IMySQLQuery } from "../../Interfaces";

type Args = {
    blockingUserId: string,
    blockedUserId: string
};

type MySQLResponse = [
    [{
        blocking_user_id: number,
        blocked_user_id: number
    }],
    IMySQLQuery
];

export const BLOCK_USER = {
    name: 'BLOCK_USER',
    type: BlockStatusType,
    args: {
        blockingUserId: { type: new GraphQLNonNull(GraphQLID) },
        blockedUserId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: Args) {
        const { blockingUserId, blockedUserId } = args;
        try {
            const checkRelationQuery = `CALL CheckBlockRelation(${blockingUserId}, ${blockedUserId})`;
            const response: MySQLResponse = await mysqlQuery(checkRelationQuery);

            const isAlreadyBlocking = response[0][0] ? true : false;

            const query = isAlreadyBlocking ?
                `CALL BlockDel(${blockingUserId}, ${blockedUserId})` :
                `CALL BlockIns(${blockingUserId}, ${blockedUserId}) `;

            await mysqlQuery(query);

            return { isBlocking: isAlreadyBlocking ? false : true }
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};