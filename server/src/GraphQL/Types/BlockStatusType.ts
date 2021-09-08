import { GraphQLObjectType, GraphQLNonNull, GraphQLBoolean } from 'graphql';

export const BlockStatusType = new GraphQLObjectType({
    name: 'BlockStatusType',
    fields: () => ({
        blocked: {
            type: new GraphQLNonNull(GraphQLBoolean)
        }
    })
});