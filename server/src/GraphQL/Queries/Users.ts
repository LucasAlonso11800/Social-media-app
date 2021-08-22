import { GraphQLNonNull, GraphQLString } from 'graphql';
import { IGetUserImage } from '../../Interfaces';
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