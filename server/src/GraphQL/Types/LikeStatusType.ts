import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt } from 'graphql';

export const LikeStatusType = new GraphQLObjectType({
    name: 'LikeStatusType',
    fields: () => ({
        liked: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        count: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
});