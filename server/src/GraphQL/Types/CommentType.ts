import { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList } from 'graphql';
import { LikeType } from './LikeType';

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
        createdAt: {
            type: new GraphQLNonNull(GraphQLString)
        },
        likes: { 
            type: new GraphQLList(LikeType)
        }
    })
});