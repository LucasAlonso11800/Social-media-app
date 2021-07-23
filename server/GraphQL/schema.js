const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const  { ADD_USER, LOGIN_USER }  = require('./Mutations/User');
const GET_ALL_POSTS = require('./Queries/Posts');

const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        all_posts: GET_ALL_POSTS
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutations',
    fields: {
        add_user: ADD_USER,
        login_user: LOGIN_USER
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});