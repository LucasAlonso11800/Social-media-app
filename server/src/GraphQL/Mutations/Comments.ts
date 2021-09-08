import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql';
import { JwtPayload } from 'jsonwebtoken';
// Types
import { CommentType } from '../Types/CommentType';
import { IAddComment, IContext, IDeleteComment, IMySQLQuery} from '../../Interfaces';
// Helpers
import checkAuth from '../../Helpers/CheckAuth';
import { mysqlQuery } from '../../Helpers/MySQLPromise';

export const ADD_COMMENT = {
    name: 'ADD_COMMENT',
    type: CommentType,
    args: {
        postId: { type: new GraphQLNonNull(GraphQLID) },
        body: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_: any, args: IAddComment, context: IContext) {
        const user = checkAuth(context) as JwtPayload;
        const { postId, body } = args;

        if (args.body.trim() === '') throw new Error('Empty comment');
        try {
            const insertCommentQuery = `
                INSERT INTO comments (
                    comment_post_id,
                    comment_user_id,
                    comment_created_at,
                    comment_body
                ) VALUES (
                    ${postId},
                    ${user.id},
                    "${new Date().toISOString().substring(0, 10)}",
                    "${body}"
                )
            `;
            const queryResult: IMySQLQuery = await mysqlQuery(insertCommentQuery, context.connection);
            
            const getCommentQuery = `SELECT 
                comment_id AS id,
                comment_body AS body,
                comment_created_at AS createdAt,
                user_username AS username
                FROM comments
                JOIN users
                ON comment_user_id = users.user_id
                WHERE comment_id = ${queryResult.insertId}
            `;

            const response = await mysqlQuery(getCommentQuery, context.connection);
            return response[0]
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};

export const DELETE_COMMENT = {
    name: 'DELETE_COMMENT',
    type: GraphQLString,
    args: {
        commentId: { type: new GraphQLNonNull(GraphQLID) },
        username: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_: any, args: IDeleteComment, context: IContext) {
        const user = checkAuth(context) as JwtPayload;
        if(args.username !== user.username) throw new Error("Action not allowed");
        try {
            const deleteCommentQuery = `DELETE FROM comments WHERE comment_id = ${args.commentId}`;
            await mysqlQuery(deleteCommentQuery, context.connection);
            return "Comment deleted"
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};