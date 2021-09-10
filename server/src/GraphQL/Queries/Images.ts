import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { mysqlQuery } from "../../Helpers/MySQLPromise";
import { IContext, IGetUserImage, IImage } from "../../Interfaces";

export const GET_USER_IMAGE = {
    type: GraphQLString,
    args: {
        userId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: IGetUserImage, context: IContext) {
        const { userId } = args
        try {
            const getUserImageQuery = `SELECT image_image FROM images WHERE image_user_id = ${userId}`;
            const response: IImage[] = await mysqlQuery(getUserImageQuery, context.connection);
            return response[0].image_image
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};