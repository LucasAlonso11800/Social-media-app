import { GraphQLNonNull, GraphQLID } from 'graphql';
import { PostType } from '../Types/PostType';
import Post from '../../Models/Post';
import checkAuth from '../../Helpers/CheckAuth';
import { IComment, IContext, ILike, ILikeComment, ILikePost } from '../../Interfaces';
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
            const post = await Post.findOne({ _id: args.postId });
            if (!post) throw new Error('Post not found')

            if (post.likes.find((like: ILike) => like.username === user.username)) {
                const newPost = await Post.findOneAndUpdate({ _id: args.postId }, {
                    likes: post.likes.filter((like: ILike) => like.username !== user.username)
                }, { new: true })
                return newPost
            }
            else {
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
            const post = await Post.findOne({ _id: args.postId });
            if (!post) throw new Error('Post not found');
            
            const { comments } = post;
            const comment = comments.find((c: IComment) => c._id == args.commentId);

            if (comment.likes.find((like: ILike) => like.username === user.username)) {
                const newComment = {
                    _id: comment._id,
                    body: comment.body,
                    username: comment.username,
                    createdAt: comment.createdAt,
                    likes: [...comment.likes.filter((like: ILike) => like.username !== user.username)]
                };
                const newPost = await Post.findOneAndUpdate({ _id: args.postId }, {
                    comments: [
                        ...comments.filter((c: IComment) => c._id.toString() !== args.commentId),
                        newComment
                    ],
                }, { new: true })
                return newPost
            }
            else {
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
                    comments: [
                        ...comments.filter((c: IComment) => {
                            return c._id.toString() !== args.commentId
                        }),
                        newComment
                    ],
                }, { new: true })
                return newPost
            }
        }
        catch (err) {
            throw new Error(err)
        }
    }
};