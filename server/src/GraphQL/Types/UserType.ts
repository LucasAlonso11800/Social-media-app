import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList } from 'graphql';
import { FollowerType } from './FollowerType';

export const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLID) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        token: { type: new GraphQLNonNull(GraphQLString) },
        username: { type: new GraphQLNonNull(GraphQLString) },
        image: { type: GraphQLString },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        followers: { type: new GraphQLList(FollowerType) },
        following: { type: new GraphQLList(FollowerType) },
    })
});