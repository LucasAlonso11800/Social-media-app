import { GraphQLNonNull, GraphQLID } from 'graphql';
// Helpers
import { mysqlQuery } from '../../Helpers/MySQLPromise';
// Types
import { BlockStatusType } from '../Types/BlockStatusType';
import { IBlockRelation, IContext } from '../../Interfaces';

type Args = {
    blockingUserId: string
    blockedUserId: string
};

export const GET_BLOCK_STATUS = {
    type: BlockStatusType,
    args: {
        blockingUserId: { type: GraphQLID },
        blockedUserId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: Args, context: IContext) {
        const { blockingUserId, blockedUserId } = args;
        
        if (blockingUserId === null) return { 
            isBlocking: false,
            isBlocked: false
        };

        try {
            const blockingRelationQuery = `SELECT * FROM blocks WHERE blocking_user_id = ${blockingUserId} AND blocked_user_id`;
            const isBlocking: IBlockRelation[] = await mysqlQuery(blockingRelationQuery, context.connection);

            const blockedRelationQuery = `SELECT * FROM blocks WHERE blocking_user_id = ${blockedUserId} AND blocked_user_id = ${blockingUserId}`;
            const isBlocked: IBlockRelation[] = await mysqlQuery(blockedRelationQuery, context.connection);

            return {
                isBlocking: isBlocking[0] ? true : false,
                isBlocked: isBlocked[0] ? true : false
            }
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};