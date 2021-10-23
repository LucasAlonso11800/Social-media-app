import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { JwtPayload } from "jsonwebtoken";
// Helpers
import checkAuth from "../../Helpers/CheckAuth";
import { mysqlQuery } from "../../Helpers/MySQLPromise";
// Types
import { IContext } from "../../Interfaces";

type Args = {
    userId: string,
    image: string
};

export const EDIT_USER_IMAGE = {
    name: 'EDIT_USER_IMAGE',
    type: GraphQLString,
    args: {
        userId: { type: new GraphQLNonNull(GraphQLID) },
        image: { type: GraphQLString }
    },
    async resolve(_: any, args: Args, context: IContext) {
        const user = checkAuth(context) as JwtPayload;
        const { image, userId } = args
        if (userId !== user.id.toString()) throw new Error("Action not allowed");

        try {
            const updateUserImageQuery = `UPDATE images SET image_image = "${image}" WHERE image_user_id = ${userId}`;
            await mysqlQuery(updateUserImageQuery)

            return image;
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};
