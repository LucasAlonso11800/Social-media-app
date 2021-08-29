import { GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql';
import { IGetUserImage, IGetUsersBySearch } from '../../Interfaces';
import User from '../../Models/User';
import { UserType } from '../Types/UserType';

export const GET_USER_IMAGE = {
    type: UserType,
    args: {
        username: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_: any, args: IGetUserImage) {
        try {
            const user = await User.findOne({ username: args.username })
            return user
        }
        catch (err) {
            throw new Error(err)
        }
    }
};

export const GET_USERS_BY_SEARCH = {
    type: GraphQLList(UserType),
    args: {
        query: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_: any, args: IGetUsersBySearch) {
        try {
            const users = await User.find({ username: { '$regex': args.query, '$options': 'i' } }).sort({ createdAt: -1 });
            return users
        }
        catch (err) {
            throw new Error(err);
        }
    }
};