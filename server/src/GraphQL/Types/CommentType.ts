import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';

export const CommentType = new GraphQLObjectType({
    name: 'CommentType',
    fields: () => ({
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        body: {
            type: new GraphQLNonNull(GraphQLString)
        },
        username: {
            type: new GraphQLNonNull(GraphQLString)
        },
        profileName: { 
            type: new GraphQLNonNull(GraphQLString) 
        },
        createdAt: {
            type: new GraphQLNonNull(GraphQLString)
        }
    })
});