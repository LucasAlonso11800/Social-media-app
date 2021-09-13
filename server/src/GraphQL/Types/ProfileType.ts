import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { UserType } from './UserType';

export const ProfileType = new GraphQLObjectType({
    name: 'ProfileType',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        profileName: {
            type: new GraphQLNonNull(GraphQLString)
        },
        profileImage: {
            type: GraphQLString
        },
        bio: {
            type: GraphQLString
        },
        username: {
            type: new GraphQLNonNull(GraphQLString)
        },
        city: {
            type: new GraphQLNonNull(GraphQLString)
        },
        country: {
            type: new GraphQLNonNull(GraphQLString)
        },
        birthDate: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
});