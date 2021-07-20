const { GraphQLList } = require('graphql');
const Post = require('../../Models/Post');
const PostType = require('../Types/PostType');

const GET_ALL_POSTS = {
    type: GraphQLList(PostType),
    async resolve() {
        try {
            const posts = await Post.find()
            return posts
        }
        catch (err) {
            throw new Error(err)
        }
    }
};

module.exports = GET_ALL_POSTS;