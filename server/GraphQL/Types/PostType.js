const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLID,
    GraphQLString
} = require('graphql');

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
        }
    })
});

module.exports = PostType;