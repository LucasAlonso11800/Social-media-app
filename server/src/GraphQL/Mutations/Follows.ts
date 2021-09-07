import { GraphQLInt, GraphQLList, GraphQLNonNull } from "graphql";
import { mysqlQuery } from "../../Helpers/MySQLPromise";
import { IContext, IFollowUser } from "../../Interfaces";
import { FollowerType } from "../Types/FollowerType";

export const FOLLOW_USER = {
    name: 'FOLLOW_USER',
    type: new GraphQLList(FollowerType),
    args: {
        follower_id: { type: new GraphQLNonNull(GraphQLInt) },
        followee_id: { type: new GraphQLNonNull(GraphQLInt) }
    },
    async resolve(_: any, args: IFollowUser, context: IContext) {
        const { follower_id, followee_id } = args;
        try {
            const checkRelationQuery = `
                SELECT * FROM follows WHERE follower_id = ${follower_id} AND followee_id = ${followee_id}
            `;
            const response: IFollowUser[] = await mysqlQuery(checkRelationQuery, context.connection);

            const query = response[0] ?
                `DELETE FROM follows WHERE follower_id = ${follower_id} AND followee_id =  ${followee_id}` :
                `INSERT INTO follows (follower_id, followee_id) VALUES (${follower_id}, ${followee_id}) `
            ;

            await mysqlQuery(query, context.connection);

            const getFollowingsQuery = `
                SELECT user_id AS id, user_username AS username FROM follows
                JOIN users ON users.user_id = followee_id
                WHERE follower_id = ${follower_id}
            `;

            return await mysqlQuery(getFollowingsQuery, context.connection);
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};