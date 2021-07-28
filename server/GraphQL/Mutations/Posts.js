const { GraphQLNonNull, GraphQLString } = require('graphql')
const PostType = require("../Types/PostType");
const Post = require("../../Models/Post");
const checkAuth = require("../../Helpers/CheckAuth");

const CREATE_POST = {
    name: 'CREATE_POST',
    type: PostType,
    args: {
        body: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(parent, args, context) {
        const user = checkAuth(context)
        if(args.body === undefined || args.body === '') throw new Error("You post can't be empty");
        if(args.body.length > 140) throw new Error("You post can't have more than 140 characters");

        try {
            const newPost = new Post({
                body: args.body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })

            const post = await Post.insertMany(newPost)
            return post[0]
        }
        catch (err) {
            throw new Error(err)
        }
    }
};

const DELETE_POST = {
    name: "DELETE_POST",
    type: GraphQLString,
    args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(parent, args, context) {
        const user = checkAuth(context)
        try {
            const post = await Post.findOne({ _id: args.id })
            if (!post) throw new Error('Post not found')

            if (user.username !== post.username) throw new Error("Action not allowed")

            await Post.deleteOne({ _id: args.id })
            return 'Post deleted'
        }
        catch (err) {
            throw new Error(err)
        }
    }
};

module.exports = { CREATE_POST, DELETE_POST };