import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';

export const LikeType = new GraphQLObjectType({
    name: 'LikeType',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        username: {
            type: new GraphQLNonNull(GraphQLString)
        },
        createdAt: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
});