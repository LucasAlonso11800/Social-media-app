import { GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString } from 'graphql';
// import { IGetPostsBySearch, IGetPostsFromUser, IGetSinglePost } from '../../Interfaces';
// import Post from '../../Models/Post';
// import User from '../../Models/User';
import { PostType } from '../Types/PostType';

export const GET_ALL_POSTS = {
    type: GraphQLList(PostType),
    async resolve() {
        try {
            return []
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};

// export const GET_SINGLE_POST = {
//     type: PostType,
//     args: {
//         id: { type: new GraphQLNonNull(GraphQLID) }
//     },
//     async resolve(_: any, args: IGetSinglePost) {
//         try {
//             const post = await Post.findOne({ _id: args.id })
//             if (!post) throw new Error('Post not found');
//             return post
//         }
//         catch (err: any) {
//             throw new Error(err)
//         }
//     }
// };

// export const GET_POSTS_FROM_USER = {
//     type: GraphQLList(PostType),
//     args: {
//         username: { type: new GraphQLNonNull(GraphQLString) }
//     },
//     async resolve(_: any, args: IGetPostsFromUser) {
//         try {
//             const user = await User.findOne({ username: args.username});
//             if(!user) throw new Error('User not found');
//             const posts = await Post.find({ username: args.username }).sort({ createdAt: -1 });
//             return posts
//         }
//         catch (err: any) {
//             throw new Error(err)
//         }
//     }
// };

// export const GET_POSTS_BY_SEARCH = {
//     type: GraphQLList(PostType),
//     args: {
//         query: { type: new GraphQLNonNull(GraphQLString) }
//     },
//     async resolve(_: any, args: IGetPostsBySearch) {
//         try {
//             const posts = await Post.find({ body: { '$regex': args.query, '$options': 'i' } }).sort({ createdAt: -1 });
//             return posts
//         }
//         catch (err: any) {
//             throw new Error(err);
//         }
//     }
// };