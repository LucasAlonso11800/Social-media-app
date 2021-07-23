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
                    likes: likes.filter(like => like.username !== user.username)
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
        catch(err){
            throw new Error(err)
        }
    }
};

module.exports = LIKE_POST;