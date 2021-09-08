import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt } from 'graphql';

export const FollowStatusType = new GraphQLObjectType({
    name: 'FollowStatusType',
    fields: () => ({
        follows: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        count: {
            type: new GraphQLNonNull(GraphQLInt)
        }
    })
});