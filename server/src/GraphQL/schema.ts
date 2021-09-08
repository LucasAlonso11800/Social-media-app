const { GraphQLSchema, GraphQLObjectType } = require('graphql');

// Queries
import { GET_ALL_POSTS } from "./Queries/Posts";

// Mutations
import { 
    ADD_USER,
    LOGIN_USER,
    DELETE_USER,
    EDIT_PROFILE,
    FOLLOW_USER,
    EDIT_USER_IMAGE,
    BLOCK_USER,
    CREATE_POST,
    DELETE_POST,
    ADD_COMMENT,
    DELETE_COMMENT,
    LIKE_POST_OR_COMMENT
} from "./Mutations/Index";

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        all_posts: GET_ALL_POSTS,
        // single_post: GET_SINGLE_POST,
        // posts_from_user: GET_POSTS_FROM_USER,
        // posts_by_search: GET_POSTS_BY_SEARCH,
        // users_by_search: GET_USERS_BY_SEARCH,
        
        // profile: GET_PROFILE
        // user_image: GET_USER_IMAGE,

        // blocked_status
        // follow_status
        // follow_list
        // like_status
        // like_list
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