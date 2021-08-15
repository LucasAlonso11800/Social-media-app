import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { UserType } from './UserType';

export const ProfileType = new GraphQLObjectType({
    name: 'ProfileType',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        profileName: {
            type: GraphQLString
        },
        bio: {
            type: GraphQLString
        },
        profileImage: {
            type: GraphQLString
        },
        user: {
            type: UserType
        }
    })
});