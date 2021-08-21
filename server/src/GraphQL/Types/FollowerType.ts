import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';

export const FollowerType = new GraphQLObjectType({
    name: 'FollowerType',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        username: {
            type: new GraphQLNonNull(GraphQLString)
        },
        image: {
            type: GraphQLString
        }
    })
});