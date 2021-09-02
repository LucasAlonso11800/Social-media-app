import { ADD_PROFILE, EDIT_PROFILE } from "./Mutations/Profile";
import { BLOCK_USER, EDIT_USER_IMAGE, FOLLOW_USER } from "./Mutations/User";
import { GET_POSTS_BY_SEARCH, GET_POSTS_FROM_USER } from "./Queries/Posts";
import { GET_PROFILE } from "./Queries/Profile";
import { GET_USERS_BY_SEARCH, GET_USER } from './Queries/Users';

const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const { ADD_USER, LOGIN_USER } = require('./Mutations/User');
const { GET_ALL_POSTS, GET_SINGLE_POST } = require('./Queries/Posts');
const { CREATE_POST, DELETE_POST } = require('./Mutations/Posts');
const { ADD_COMMENT, DELETE_COMMENT } = require('./Mutations/Comments');
const { LIKE_POST, LIKE_COMMENT } = require('./Mutations/Likes');

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        all_posts: GET_ALL_POSTS,
        single_post: GET_SINGLE_POST,
        posts_from_user: GET_POSTS_FROM_USER,
        posts_by_search: GET_POSTS_BY_SEARCH,
        user_image: GET_USER,
        blocked_users: GET_USER,
        users_by_search: GET_USERS_BY_SEARCH,
        profile: GET_PROFILE
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutations',
    fields: {
        add_user: ADD_USER,
        login_user: LOGIN_USER,
        edit_user_image: EDIT_USER_IMAGE,
        block_user: BLOCK_USER,
        follow_user: FOLLOW_USER,
        create_post: CREATE_POST,
        delete_post: DELETE_POST,
        add_comment: ADD_COMMENT,
        delete_comment: DELETE_COMMENT,
        like_post: LIKE_POST,
        like_comment: LIKE_COMMENT,
        add_profile: ADD_PROFILE,
        edit_profile: EDIT_PROFILE
    }
});

export default new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});