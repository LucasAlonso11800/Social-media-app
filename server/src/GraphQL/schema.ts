const { GraphQLSchema, GraphQLObjectType } = require('graphql');

import { BLOCK_USER } from "./Mutations/Blocks";
import { ADD_COMMENT, DELETE_COMMENT } from "./Mutations/Comments";
import { FOLLOW_USER } from "./Mutations/Follows";
import { EDIT_USER_IMAGE } from "./Mutations/Images";
import { LIKE_POST_OR_COMMENT } from "./Mutations/Likes";
import { CREATE_POST, DELETE_POST } from "./Mutations/Posts";
import { EDIT_PROFILE } from "./Mutations/Profile";
import { ADD_USER, DELETE_USER, LOGIN_USER } from "./Mutations/User";

import { GET_ALL_POSTS } from "./Queries/Posts";

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        all_posts: GET_ALL_POSTS,
        // single_post: GET_SINGLE_POST,
        // posts_from_user: GET_POSTS_FROM_USER,
        // posts_by_search: GET_POSTS_BY_SEARCH,
        // user_image: GET_USER,
        // blocked_users: GET_USER,
        // users_by_search: GET_USERS_BY_SEARCH,
        // profile: GET_PROFILE
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutations',
    fields: {
        // Users
        add_user: ADD_USER,
        login_user: LOGIN_USER,
        delete_user: DELETE_USER,
        // Profile
        edit_profile: EDIT_PROFILE,
        // Follows
        follow_user: FOLLOW_USER,
        // Images
        edit_user_image: EDIT_USER_IMAGE,
        // Blocks
        block_user: BLOCK_USER,
        // Posts
        create_post: CREATE_POST,
        delete_post: DELETE_POST,
        // Comments
        add_comment: ADD_COMMENT,
        delete_comment: DELETE_COMMENT,
        // Likes
        like_post_or_comment: LIKE_POST_OR_COMMENT,
    }
});

export default new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});