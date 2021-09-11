import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql';
import { JwtPayload } from 'jsonwebtoken';
// Helpers
import checkAuth from "../../Helpers/CheckAuth";
import validatePost from '../../Helpers/CreatePostValidation';
import { mysqlQuery } from '../../Helpers/MySQLPromise';
// Types
import { PostType } from "../Types/PostType";
import { IContext, IMySQLQuery, IPost } from '../../Interfaces';

type Args = {
    body: string,
    postId: string,
    username: string
};

export const CREATE_POST = {
    name: 'CREATE_POST',
    type: PostType,
    args: {
        body: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_: any, args: Pick<Args, "body">, context: IContext) {
        const user = checkAuth(context) as JwtPayload;

        validatePost(args.body);

        try {
            const insertPostQuery = `
                INSERT INTO posts(post_user_id, post_body, post_created_at)
                VALUES(${user.id}, "${args.body}", "${new Date().toISOString().substring(0, 10)}"
                )
            `;
            const queryResult: IMySQLQuery = await mysqlQuery(insertPostQuery, context.connection);

            const getPostQuery = `
                SELECT post_id AS postId, 
                post_body AS body,
                post_created_at AS createdAt,
                post_user_id AS userId,
                user_username AS username
                FROM posts 
                JOIN users
                ON users.user_id = post_user_id
                WHERE post_id = ${queryResult.insertId}
            `;
            const response: IPost[] = await mysqlQuery(getPostQuery, context.connection);
            return response[0]
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};

export const DELETE_POST = {
    name: "DELETE_POST",
    type: GraphQLString,
    args: {
        postId: { type: new GraphQLNonNull(GraphQLID) },
        username: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_: any, args: Omit<Args, "body">, context: IContext) {
        const user = checkAuth(context) as JwtPayload;
        if (user.username !== args.username) throw new Error("Action not allowed");
        try {
            const deletePostQuery = `DELETE FROM posts WHERE post_id = ${args.postId}`;
            await mysqlQuery(deletePostQuery, context.connection);
            return 'Post deleted'
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};