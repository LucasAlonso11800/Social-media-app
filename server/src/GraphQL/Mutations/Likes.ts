import { GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { JwtPayload } from 'jsonwebtoken';
// Types
import { LikeStatusType } from '../Types/LikeStatusType';
import { IContext, ILike, ILikePostOrComment } from '../../Interfaces';
// Helpers
import checkAuth from '../../Helpers/CheckAuth';
import { mysqlQuery } from '../../Helpers/MySQLPromise';

export const LIKE_POST_OR_COMMENT = {
    name: 'LIKE_POST_OR_COMMENT',
    type: LikeStatusType,
    args: {
        postId: { type: GraphQLID },
        commentId: { type: GraphQLID },
        type: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_: any, args: ILikePostOrComment, context: IContext) {
        const user = checkAuth(context) as JwtPayload;
        const { postId, commentId, type } = args;
        try {
            switch (type) {
                case "P": return await likePost(user, postId, context)
                case "C": return await likeComment(user, commentId, context)
                default: return
            }
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};

async function likePost(user: JwtPayload, postId: number, context: IContext) {
    const checkRelationQuery = `SELECT * FROM likes WHERE like_post_id = ${postId} && like_user_id = ${user.id}`;
    const response: ILike[] = await mysqlQuery(checkRelationQuery, context.connection);

    const query = response[0] ?
        `DELETE FROM likes WHERE like_id = ${response[0].like_id}` :
        `INSERT INTO likes (like_type, like_user_id, like_post_id) VALUES("P", ${user.id}, ${postId})`
    ;
    await mysqlQuery(query, context.connection);
    
    const getLikeList = `SELECT * FROM likes WHERE like_post_id = ${postId}`;
    const likeList: ILike[] = await mysqlQuery(getLikeList, context.connection);
    
    return {
        liked: response[0] ? false : true,
        count: likeList.length,
    }
};

async function likeComment(user: JwtPayload, commentId: number, context: IContext) {
    const checkRelationQuery = `SELECT * FROM likes WHERE like_comment_id = ${commentId} && like_user_id = ${user.id}`;
    const response: ILike[] = await mysqlQuery(checkRelationQuery, context.connection);

    const query = response[0] ?
        `DELETE FROM likes WHERE like_id = ${response[0].like_id}` :
        `INSERT INTO likes (like_type, like_user_id, like_comment_id) VALUES("C", ${user.id}, ${commentId})`
    ;
    await mysqlQuery(query, context.connection);
    
    const getLikeList = `SELECT * FROM likes WHERE like_comment_id = ${commentId}`;
    const likeList: ILike[] = await mysqlQuery(getLikeList, context.connection);
    
    return {
        liked: response[0] ? false : true,
        count: likeList.length,
    }
};
