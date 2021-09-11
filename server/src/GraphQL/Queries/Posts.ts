import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
// Helpers
import { mysqlQuery } from '../../Helpers/MySQLPromise';
// Types
import { IContext, IPost } from '../../Interfaces';
import { PostType } from '../Types/PostType';

export const GET_SINGLE_POST = {
    type: PostType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: { id: string }, context: IContext) {
        try {
            const getPostQuery = `
                SELECT
                    post_id AS postId,
                    post_body AS body,
                    post_created_at AS createdAt,
                    post_user_id AS userId,
                    user_username AS username
                    FROM posts
                    JOIN users
                    ON users.user_id = post_user_id
                    WHERE post_id = ${args.id}
            `;
            const response: IPost[] = await mysqlQuery(getPostQuery, context.connection);
            if (response[0]) return response[0];
            throw new Error("Post not found");
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};

export const GET_POSTS_FROM_USER = {
    type: GraphQLList(PostType),
    args: {
        userId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: { userId: string }, context: IContext) {
        try {
            const getPostsQuery = `
                SELECT
                    post_id AS postId,
                    post_body AS body,
                    post_user_id AS userId,
                    user_username AS username,
                    profile_profile_name AS profileName
                    FROM posts
                    JOIN users
                    ON users.user_id = post_user_id
                    JOIN profiles
                    ON profiles.user_id = post_user_id
                    WHERE post_user_id = ${args.userId}
            `;
            return await mysqlQuery(getPostsQuery, context.connection)
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};

export const GET_HOME_PAGE_POSTS = {
    type: GraphQLList(PostType),
    args: {
        userId: { type: GraphQLID }
    },
    async resolve(_: any, args: { userId: string }, context: IContext) {
        const { userId } = args;
        try {
            const getPostsQuery = userId ?
                `SELECT 
                post_id AS postId,
                post_body AS body,
                post_user_id AS userId,
                post_created_at AS createdAt,
                user_username AS username
                FROM follows
                JOIN posts
                ON post_user_id = followee_id
                JOIN users
                ON user_id = followee_id
                WHERE follower_id = ${args.userId}
            `
                :
                `SELECT
                post_id AS postId,
                post_body AS body,
                post_user_id AS userId,
                post_created_at AS createdAt,
                user_username AS username
                FROM posts
                ORDER BY post_created_at
                LIMIT 200
            `;
            return await mysqlQuery(getPostsQuery, context.connection)
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};

export const GET_POSTS_BY_SEARCH = {
    type: GraphQLList(PostType),
    args: {
        query: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_: any, args: { query: string }, context: IContext) {
        try {
            const getPostsBySearchQuery = `
                SELECT
                    post_id AS postId,
                    post_body AS body,
                    post_user_id AS userId,
                    post_created_at AS createdAt,
                    user_username AS username
                    FROM posts
                    JOIN users
                    ON users.user_id = post_user_id
                    WHERE post_body LIKE "%${args.query}%"
                    ORDER BY post_created_at
            `;
            return await mysqlQuery(getPostsBySearchQuery, context.connection);
        }
        catch (err: any) {
            throw new Error(err);
        }
    }
};