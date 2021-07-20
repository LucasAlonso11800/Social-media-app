const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLID,
    GraphQLString
} = require('graphql')

const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        token: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        createdAt: { type: new GraphQLNonNull(GraphQLString) }
    })
});

module.exports = UserType;