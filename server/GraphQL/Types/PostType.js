const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLList,
    GraphQLID,
    GraphQLString
} = require('graphql');
const CommentType = require('./CommentType');
const LikeType = require('./LikeType');

const PostType = new GraphQLObjectType({
    name: 'PostType',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        body: {
            type: new GraphQLNonNull(GraphQLString)
        },
        username: {
            type: new GraphQLNonNull(GraphQLString)
        },
        createdAt: {
            type: new GraphQLNonNull(GraphQLString)
        },
        comments: {
            type: new GraphQLList(CommentType)
        },
        likes: {
            type: new GraphQLList(LikeType)
        },
    })
});

module.exports = PostType;