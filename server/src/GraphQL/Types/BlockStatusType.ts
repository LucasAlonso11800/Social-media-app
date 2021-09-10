import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean } from 'graphql';

export const BlockStatusType = new GraphQLObjectType({
    name: 'BlockStatusType',
    fields: () => ({
        isBlocking: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
        isBlocked: {
            type: new GraphQLNonNull(GraphQLBoolean)
        },
    })
});