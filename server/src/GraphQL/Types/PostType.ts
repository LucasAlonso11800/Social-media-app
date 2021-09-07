import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';

export const PostType = new GraphQLObjectType({
    name: 'PostType',
    fields: () => ({
        postId: {
            type: new GraphQLNonNull(GraphQLID)
        },
        body: {
            type: new GraphQLNonNull(GraphQLString)
        },
        createdAt: {
            type: new GraphQLNonNull(GraphQLString)
        },
        userId: {
            type: new GraphQLNonNull(GraphQLID)
        },
        username: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
});