const { GraphQLSchema, GraphQLObjectType } = require('graphql');

// Queries
import { GET_HOME_PAGE_POSTS, GET_POSTS_BY_SEARCH, GET_POSTS_FROM_USER, GET_SINGLE_POST } from "./Queries/Posts";

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
import { GET_LIKE_LIST, GET_LIKE_STATUS } from "./Queries/Likes";
import { GET_FOLLOW_LIST, GET_FOLLOW_STATUS } from "./Queries/Follows";
import { GET_BLOCK_STATUS } from "./Queries/Blocks";
import { GET_USER_IMAGE } from "./Queries/Images";
import { GET_PROFILE } from "./Queries/Profile";
import { GET_USERS_BY_SEARCH, GET_USER_FOLLOW_COUNT } from "./Queries/Users";

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        single_post: GET_SINGLE_POST,
        posts_from_user: GET_POSTS_FROM_USER,
        home_page_posts: GET_HOME_PAGE_POSTS,
        posts_by_search: GET_POSTS_BY_SEARCH,
        profile: GET_PROFILE,
        users_by_search: GET_USERS_BY_SEARCH,
        user_image: GET_USER_IMAGE,
        user_follow_count: GET_USER_FOLLOW_COUNT,
        blocked_status: GET_BLOCK_STATUS,
        follow_status: GET_FOLLOW_STATUS,
        follow_list: GET_FOLLOW_LIST,
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