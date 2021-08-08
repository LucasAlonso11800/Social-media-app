import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID, GraphQLString } from 'graphql';
import { CommentType } from './CommentType';
import { LikeType } from './LikeType';

export const PostType = new GraphQLObjectType({
    name: 'PostType',
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
        comments: {
            type: new GraphQLList(CommentType)
        },
        likes: {
            type: new GraphQLList(LikeType)
        },
    })
});