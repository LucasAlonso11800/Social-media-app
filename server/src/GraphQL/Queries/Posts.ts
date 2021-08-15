import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
import { IGetPostsFromUser, IGetSinglePost } from '../../Interfaces';
import Post from '../../Models/Post';
import { PostType } from '../Types/PostType';

export const GET_ALL_POSTS = {
    type: GraphQLList(PostType),
    async resolve() {
        try {
            Post.find().populate()
            const posts = await Post.find().sort({ createdAt: -1 })
            return posts
        }
        catch (err) {
            throw new Error(err)
        }
    }
};

export const GET_SINGLE_POST = {
    type: PostType,
    args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: IGetSinglePost) {
        try {
            const post = await Post.findOne({ _id: args.id })
            if (!post) throw new Error('Post not found');
            return post
        }
        catch (err) {
            throw new Error(err)
        }
    }
};

export const GET_POSTS_FROM_USER = {
    type: GraphQLList(PostType),
    args: {
        username: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_: any, args: IGetPostsFromUser) {
        try {
            const posts = await Post.find({ username: args.username });
            return posts
        }
        catch (err) {
            throw new Error(err)
        }
    }
};