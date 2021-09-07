import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";
import { mysqlQuery } from "../../Helpers/MySQLPromise";
import { IBlockUser, IContext } from "../../Interfaces";
import { BlockedType } from "../Types/BlockedType";

export const BLOCK_USER = {
    name: 'BLOCK_USER',
    type: new GraphQLList(BlockedType),
    args: {
        blocking_user_id: { type: new GraphQLNonNull(GraphQLID) },
        blocked_user_id: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: IBlockUser, context: IContext) {
        const { blocking_user_id, blocked_user_id } = args;
        try {
            const checkRelationQuery = `
                SELECT * FROM blocks WHERE blocking_user_id = ${blocking_user_id} AND blocked_user_id = ${blocked_user_id}
            `;
            const response: IBlockUser[] = await mysqlQuery(checkRelationQuery, context.connection);

            const query = response[0] ?
                `DELETE FROM blocks WHERE blocking_user_id = ${blocking_user_id} AND blocked_user_id = ${blocked_user_id}` :
                `INSERT INTO blocks (blocking_user_id, blocked_user_id) VALUES (${blocking_user_id}, ${blocked_user_id}) `
            ;

            await mysqlQuery(query, context.connection);

            const getBlockedUsersQuery = `
                SELECT user_id AS id, user_username AS username FROM blocks
                JOIN users ON users.user_id = blocked_user_id
                WHERE blocking_user_id = ${blocking_user_id}
            `;

            return await mysqlQuery(getBlockedUsersQuery, context.connection);
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};