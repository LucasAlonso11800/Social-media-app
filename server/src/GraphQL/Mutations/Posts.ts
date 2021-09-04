import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql';
import { PostType } from "../Types/PostType";
import Post from "../../Models/Post";
import checkAuth from "../../Helpers/CheckAuth";
import { IContext, ICreatePost, IDeletePost, IPost } from '../../Interfaces';
import { JwtPayload } from 'jsonwebtoken';
import validatePost from '../../Helpers/CreatePostValidation';

export const CREATE_POST = {
    name: 'CREATE_POST',
    type: PostType,
    args: {
        body: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_: any, args: ICreatePost, context: IContext) {
        const user = checkAuth(context) as JwtPayload;

        validatePost(args.body);

        try {
            const newPost = new Post({
                body: args.body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })

            const post: IPost[] = await Post.insertMany(newPost)
            return post[0]
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};

export const DELETE_POST = {
    name: "DELETE_POST",
    type: GraphQLString,
    args: {
        postId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: IDeletePost, context: IContext) {
        const user = checkAuth(context) as JwtPayload;
        try {
            const post = await Post.findOne({ _id: args.postId })
            if (!post) throw new Error('Post not found')

            if (user.username !== post.username) throw new Error("Action not allowed")

            await Post.deleteOne({ _id: args.postId })
            return 'Post deleted'
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};