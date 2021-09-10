import { GraphQLNonNull, GraphQLID } from 'graphql';
import { mysqlQuery } from '../../Helpers/MySQLPromise';
import { IBlockRelation, IContext, IFollowRelation, IGetBlockStatus } from '../../Interfaces';
import { BlockStatusType } from '../Types/BlockStatusType';

export const GET_BLOCK_STATUS = {
    type: BlockStatusType,
    args: {
        blockingUserId: { type: new GraphQLNonNull(GraphQLID) },
        blockedUserId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: IGetBlockStatus, context: IContext) {
        const { blockingUserId, blockedUserId } = args;

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