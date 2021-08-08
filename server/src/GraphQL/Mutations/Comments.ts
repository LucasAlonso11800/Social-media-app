import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql';
import { PostType } from '../Types/PostType';
import Post from '../../Models/Post';
import checkAuth from '../../Helpers/CheckAuth';
import { IAddComment, IComment, IContext, IDeleteComment } from '../../Interfaces';
import { JwtPayload } from 'jsonwebtoken';

export const ADD_COMMENT = {
    name: 'ADD_COMMENT',
    type: PostType,
    args: {
        postId: { type: new GraphQLNonNull(GraphQLID) },
        body: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_: any, args: IAddComment, context: IContext) {
        const user = checkAuth(context) as JwtPayload;
        if (args.body.trim() === '') throw new Error('Empty comment')
        try {
            const post = await Post.findOne({ _id: args.postId });
            if (!post) throw new Error('Post not found');

            const newPost = await Post.findOneAndUpdate({ _id: args.postId }, {
                comments:
                    [{
                        body: args.body,
                        username: user.username,
                        createdAt: new Date().toISOString()
                    }, ...post.comments]
            }, { new: true })

            return newPost
        }
        catch (err) {
            throw new Error(err)
        }
    }
};

export const DELETE_COMMENT = {
    name: 'DELETE_COMMENT',
    type: PostType,
    args: {
        commentId: { type: new GraphQLNonNull(GraphQLID) },
        postId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: IDeleteComment, context: IContext) {
        const user = checkAuth(context) as JwtPayload;
        try {
            const post = await Post.findOne({ _id: args.postId });
            if (!post) throw new Error('Post not found');

            const comment = post.comments.filter((c: IComment) => c._id == args.commentId);

            if (comment.length === 0) throw new Error('Comment not found');
            if (comment[0].username !== user.username) throw new Error('Action not allowed');

            const newPost = await Post.findOneAndUpdate({ _id: args.postId }, {
                comments: post.comments.filter((c: IComment) => c._id !== comment[0]._id),
            }, { new: true })

            return newPost
        }
        catch (err) {
            throw new Error(err)
        }
    }
};