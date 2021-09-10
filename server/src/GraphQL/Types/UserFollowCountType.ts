import { GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';

export const UserFollowCountType = new GraphQLObjectType({
    name: 'UserFollowCountType',
    fields: () => ({
        followerCount: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        followingCount: {
            type: new GraphQLNonNull(GraphQLInt)
        },
    })
});