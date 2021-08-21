import { GraphQLNonNull, GraphQLID } from 'graphql';
import { PostType } from '../Types/PostType';
import Post from '../../Models/Post';
import checkAuth from '../../Helpers/CheckAuth';
import { IContext, ILikeComment, ILikePost, IPost } from '../../Interfaces';
import { JwtPayload } from 'jsonwebtoken';

export const LIKE_POST = {
    name: 'LIKE_POST',
    type: PostType,
    args: {
        postId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: ILikePost, context: IContext) {
        const user = checkAuth(context) as JwtPayload;
        try {
            const post: IPost = await Post.findOne({ _id: args.postId });
            if (!post) throw new Error('Post not found');

            const postAlreadyLiked = post.likes.find(like => like.username === user.username);

            if (postAlreadyLiked) {
                const newPost = await Post.findOneAndUpdate({ _id: args.postId }, {
                    likes: post.likes.filter(like => like.username !== user.username)
                }, { new: true })
                return newPost
            };

            if (!postAlreadyLiked) {
                const newPost = await Post.findOneAndUpdate({ _id: args.postId }, {
                    likes: [...post.likes, {
                        username: user.username,
                        createdAt: new Date().toISOString()
                    }]
                }, { new: true })
                return newPost
            }
        }
        catch (err) {
            throw new Error(err)
        }
    }
};

export const LIKE_COMMENT = {
    name: 'LIKE_COMMENT',
    type: PostType,
    args: {
        commentId: { type: new GraphQLNonNull(GraphQLID) },
        postId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: ILikeComment, context: IContext) {
        const user = checkAuth(context) as JwtPayload;
        try {
            const post: IPost = await Post.findOne({ _id: args.postId });
            if (!post) throw new Error('Post not found');

            const { comments } = post;
            const comment = comments.find(c => c._id == args.commentId);
            if (!comment) throw new Error('Comment not found');

            const commentAlreadyLiked = comment.likes.find(like => like.username === user.username)

            if (commentAlreadyLiked) {
                const newComment = {
                    _id: comment._id,
                    body: comment.body,
                    username: comment.username,
                    createdAt: comment.createdAt,
                    likes: [...comment.likes.filter(like => like.username !== user.username)]
                };
                const newPost = await Post.findOneAndUpdate({ _id: args.postId }, {
                    comments: [...comments.filter(c => c._id.toString() !== args.commentId), newComment],
                }, { new: true })
                return newPost
            };

            if (!commentAlreadyLiked) {
                const newComment = {
                    _id: comment._id,
                    body: comment.body,
                    username: comment.username,
                    createdAt: comment.createdAt,
                    likes: [...comment.likes, {
                        username: user.username,
                        createdAt: new Date().toISOString()
                    }]
                };
                const newPost = await Post.findOneAndUpdate({ _id: args.postId }, {
                    comments: [...comments.filter(c => c._id.toString() !== args.commentId), newComment],
                }, { new: true })
                return newPost
            }
        }
        catch (err) {
            throw new Error(err)
        }
    }
};