import { GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList } from 'graphql';
// Types
import { LikeStatusType } from '../Types/LikeStatusType';
import { LikeType } from '../Types/LikeType';
import { IContext, IGetLikeList, IGetLikeStatus, ILike } from '../../Interfaces';
// Helpers
import { mysqlQuery } from '../../Helpers/MySQLPromise';

export const GET_LIKE_STATUS = {
    type: LikeStatusType,
    args: {
        commentId: { type: GraphQLID },
        postId: { type: GraphQLID },
        userId: { type: GraphQLID },
        type: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_: any, args: IGetLikeStatus, context: IContext) {
        const { commentId, postId, type, userId } = args;

        try {
            const getLikesListQuery = type === "C" ?
                `SELECT * FROM likes WHERE like_comment_id = ${commentId}` :
                `SELECT * FROM likes WHERE like_post_id = ${postId}`;

            const likesList: ILike[] = await mysqlQuery(getLikesListQuery, context.connection);
            const userHasLiked = likesList.find(like => like.like_user_id.toString() === userId);

            return {
                liked: userHasLiked ? true : false,
                count: likesList.length
            }
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};

export const GET_LIKE_LIST = {
    type: GraphQLList(LikeType),
    args: {
        commentId: { type: GraphQLID },
        postId: { type: GraphQLID },
        type: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_: any, args: IGetLikeList, context: IContext) {
        const { commentId, postId, type } = args;

        try {
            const getLikesListQuery = type === "C" ?
                `SELECT 
                    like_id AS id,
                    user_username AS username
                    FROM likes 
                    JOIN users
                    ON users.user_id = like_user_id
                    WHERE like_comment_id = ${commentId}` :
                `SELECT 
                    like_id AS id,
                    user_username AS username
                    FROM likes 
                    JOIN users
                    ON users.user_id = like_user_id
                    WHERE like_post_id = ${postId}`
                ;

            return await mysqlQuery(getLikesListQuery, context.connection)
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};