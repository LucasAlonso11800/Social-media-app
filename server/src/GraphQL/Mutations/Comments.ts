import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql';
import { JwtPayload } from 'jsonwebtoken';
// Helpers
import checkAuth from '../../Helpers/CheckAuth';
import { mysqlQuery } from '../../Helpers/MySQLPromise';
// Types
import { CommentType } from '../Types/CommentType';
import { IComment, IContext, IMySQLQuery } from '../../Interfaces';

type Args = {
    postId: string,
    body: string,
    commentId: string,
    userId: string
};

type MySQLResponse = [
    [IComment],
    IMySQLQuery
];

export const ADD_COMMENT = {
    name: 'ADD_COMMENT',
    type: CommentType,
    args: {
        postId: { type: new GraphQLNonNull(GraphQLID) },
        body: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_: any, args: Pick<Args, "postId" | "body">, context: IContext) {
        const user = checkAuth(context) as JwtPayload;
        const { postId, body } = args;

        if (args.body.trim() === '') throw new Error('Empty comment');
        try {
            const date = new Date().toISOString().substring(0, 19);
  
            const queryResult: IMySQLQuery = await mysqlQuery(`CALL CommentIns(${postId}, ${user.id}, "${date}", "${body}")`);
            const response: MySQLResponse = await mysqlQuery(`CALL SingleCommentGet(${queryResult.insertId})`);
            return response[0][0]
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
        userId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: Pick<Args, "commentId" | "userId">, context: IContext) {
        const user = checkAuth(context) as JwtPayload;

        const { commentId, userId } = args;
        if (userId !== user.id.toString()) throw new Error("Action not allowed");

        try {
            const deleteCommentQuery = `CALL CommentDel(${commentId})`;
            await mysqlQuery(deleteCommentQuery);
            return "Comment deleted"
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};