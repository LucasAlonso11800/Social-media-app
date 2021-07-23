const { GraphQLNonNull, GraphQLString, GraphQLID } = require('graphql');
const PostType = require('../Types/PostType');
const Post = require('../../Models/Post');
const checkAuth = require('../../Helpers/CheckAuth');

const ADD_COMMENT = {
    name: 'ADD_COMMENT',
    type: PostType,
    args: {
        postId: { type: new GraphQLNonNull(GraphQLID) },
        body: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(parent, args, context) {
        const user = checkAuth(context);
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

const DELETE_COMMENT = {
    name: 'DELETE_COMMENT',
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
    
            const comment = post.comments.filter(c => c._id == args.commentId);
    
            if(comment.length === 0) throw new Error('Comment not found');
            if (comment[0].username !== user.username) throw new Error('Action not allowed');
    
            const newPost = await Post.findOneAndUpdate({ _id: args.postId }, {
                comments: post.comments.filter(c => c._id !== comment[0]._id),
            }, { new: true })
    
            return newPost
        }
        catch(err){
            throw new Error(err)
        }
    }
};

module.exports = { ADD_COMMENT, DELETE_COMMENT };