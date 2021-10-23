import { GraphQLID, GraphQLString } from "graphql";
// Helpers
import { mysqlQuery } from "../../Helpers/MySQLPromise";
// Types
import { IContext, IImage } from "../../Interfaces";

export const GET_USER_IMAGE = {
    type: GraphQLString,
    args: {
        userId: { type: GraphQLID }
    },
    async resolve(_: any, args: { userId: string }, context: IContext) {
        const { userId } = args

        try {
            const getUserImageQuery = `SELECT image_image FROM images WHERE image_user_id = ${userId}`;
            const response: IImage[] = await mysqlQuery(getUserImageQuery);
            return response[0] ? response[0].image_image : null
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};