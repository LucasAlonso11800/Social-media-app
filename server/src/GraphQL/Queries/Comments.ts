import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";
// Types
import { CommentType } from "../Types/CommentType";
import { IContext, IGetCommentsFromPost } from "../../Interfaces";
// Helpers
import { mysqlQuery } from "../../Helpers/MySQLPromise";

export const GET_COMMENTS_FROM_POSTS = {
    type: GraphQLList(CommentType),
    args: {
        postId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: IGetCommentsFromPost, context: IContext) {
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
            `;
            return await mysqlQuery(getCommentsQuery, context.connection)
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};