import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } from "graphql";
// Helpers
import { mysqlQuery } from "../../Helpers/MySQLPromise";
// Types
import { CommentType } from "../Types/CommentType";
import { IContext } from "../../Interfaces";

export const GET_COMMENTS_FROM_POSTS = {
    type: GraphQLList(CommentType),
    args: {
        postId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: { postId: string }, context: IContext) {
        try {
            const getCommentsQuery = `
                SELECT
                    comment_id AS id,
                    comment_body AS body,
                    comment_created_at AS createdAt,
                    user_username AS username,
                    profile_profile_name AS profileName
                    FROM comments
                    JOIN users
                    ON users.user_id = comment_user_id
                    JOIN profiles
                    ON profiles.profile_user_id = comment_user_id
                    WHERE comment_post_id = ${args.postId}
                    ORDER BY comment_created_at DESC
            `;
            return await mysqlQuery(getCommentsQuery)
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};

export const GET_COMMENT_COUNT = {
    type: GraphQLInt,
    args: {
        postId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: { postId: string }, context: IContext) {
        try {
            const getCommentCountQuery = `SELECT COUNT(*) AS count FROM comments WHERE comment_post_id = ${args.postId}`;
            const response = await mysqlQuery(getCommentCountQuery)
            return response[0].count
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};