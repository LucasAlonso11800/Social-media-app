const { GraphQLList, GraphQLNonNull, GraphQLID } = require('graphql');
const Post = require('../../Models/Post');
const PostType = require('../Types/PostType');

const GET_ALL_POSTS = {
    type: GraphQLList(PostType),
    async resolve() {
        try {
            const posts = await Post.find().sort({ createdAt: -1})
            return posts
        }
        catch (err) {
            throw new Error(err)
        }
    }
};

const GET_SINGLE_POST = {
    type: PostType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(parent, args) {
        try {
            const post = await Post.findOne({ _id: args.id })
            if (!post) throw new Error('Post not found');
            return post
        }
        catch (err) {
            throw new Error(err)
        }
    }
};

module.exports = { GET_ALL_POSTS, GET_SINGLE_POST };