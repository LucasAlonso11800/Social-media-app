import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLInt } from 'graphql';

export const FollowStatusType = new GraphQLObjectType({
    name: 'FollowStatusType',
    fields: () => ({
        follows: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        followerCount: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        followeeCount: {
            type: new GraphQLNonNull(GraphQLInt)
        },
    })
});