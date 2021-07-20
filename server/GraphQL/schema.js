const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const GET_ALL_POSTS = require('./Queries/Posts');

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        all_posts: GET_ALL_POSTS
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});