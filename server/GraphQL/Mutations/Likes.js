const { GraphQLNonNull, GraphQLID } = require('graphql');
const Post = require('../../Models/Post');
const PostType = require('../Types/PostType');
const checkAuth = require('../../Helpers/CheckAuth');

const LIKE_POST = {
    name: 'LIKE_POST',
    type: PostType,
    args: {
        postId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(parent, args, context) {
        const user = checkAuth(context);
        try {
            const post = await Post.findOne({ _id: args.postId });
            if (!post) throw new Error('Post not found')

            if (post.likes.find(like => like.username === user.username)) {
                const newPost = await Post.findOneAndUpdate({ _id: args.postId }, {
                    likes: post.likes.filter(like => like.username !== user.username)
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

const LIKE_COMMENT = {
    name: 'LIKE_COMMENT',
    type: PostType,
    args: {
        commentId: { type: new GraphQLNonNull(GraphQLID) },
        postId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(parent, args, context) {
        const user = checkAuth(context);
        try {
            const post = await Post.findOne({ _id: args.postId });
            if (!post) throw new Error('Post not found');
            
            const { comments } = post;
            const comment = comments.find(c => c._id == args.commentId);

            if (comment.likes.find(like => like.username === user.username)) {
                const newComment = {
                    _id: comment._id,
                    body: comment.body,
                    username: comment.username,
                    createdAt: comment.createdAt,
                    likes: [...comment.likes.filter(l => l.username !== user.username)]
                };
                const newPost = await Post.findOneAndUpdate({ _id: args.postId }, {
                    comments: [
                        ...comments.filter(c => c._id.toString() !== args.commentId),
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
                        ...comments.filter(c => {
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

module.exports = { LIKE_POST, LIKE_COMMENT };