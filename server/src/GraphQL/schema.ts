const { GraphQLSchema, GraphQLObjectType } = require('graphql');

// Queries
import {
    GET_USERS_BY_SEARCH,
    GET_PROFILE, 
    GET_FOLLOW_LIST, GET_FOLLOW_STATUS,
    GET_USER_IMAGE, 
    GET_BLOCK_STATUS,
    GET_HOME_PAGE_POSTS, GET_POSTS_BY_SEARCH, GET_POSTS_FROM_USER, GET_SINGLE_POST,
    GET_COMMENTS_FROM_POSTS, GET_COMMENT_COUNT,
    GET_LIKE_LIST, GET_LIKE_STATUS
} from './Queries/Index';

// Mutations
import { 
    ADD_USER, LOGIN_USER, DELETE_USER,
    EDIT_PROFILE,
    FOLLOW_USER,
    EDIT_USER_IMAGE,
    BLOCK_USER,
    CREATE_POST, DELETE_POST,
    ADD_COMMENT, DELETE_COMMENT,
    LIKE_POST_OR_COMMENT
} from "./Mutations/Index";

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        // Users
        users_by_search: GET_USERS_BY_SEARCH,
        // Profile
        profile: GET_PROFILE,
        // Follows
        follow_status: GET_FOLLOW_STATUS,
        follow_list: GET_FOLLOW_LIST,
        // Images
        user_image: GET_USER_IMAGE,
        // Blocks
        block_status: GET_BLOCK_STATUS,
        // Posts
        posts_from_user: GET_POSTS_FROM_USER,
        home_page_posts: GET_HOME_PAGE_POSTS,
        posts_by_search: GET_POSTS_BY_SEARCH,
        single_post: GET_SINGLE_POST,
        // Comments
        comments_from_posts: GET_COMMENTS_FROM_POSTS,
        comment_count: GET_COMMENT_COUNT,
        // Likes
        like_status: GET_LIKE_STATUS,
        like_list: GET_LIKE_LIST
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