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
        single_post: GET_SINGLE_POST
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutations',
    fields: {
        add_user: ADD_USER,
        login_user: LOGIN_USER,
        create_post: CREATE_POST,
        delete_post: DELETE_POST,
        add_comment: ADD_COMMENT,
        delete_comment: DELETE_COMMENT,
        like_post: LIKE_POST,
        like_comment: LIKE_COMMENT
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});