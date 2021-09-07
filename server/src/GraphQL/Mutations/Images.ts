import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { JwtPayload } from "jsonwebtoken";
import checkAuth from "../../Helpers/CheckAuth";
import { mysqlQuery } from "../../Helpers/MySQLPromise";
import { IContext, IEditUserImage } from "../../Interfaces";

export const EDIT_USER_IMAGE = {
    name: 'EDIT_USER_IMAGE',
    type: GraphQLString,
    args: {
        userId: { type: new GraphQLNonNull(GraphQLID) },
        image: { type: GraphQLString }
    },
    async resolve(_: any, args: IEditUserImage, context: IContext) {
        const user = checkAuth(context) as JwtPayload;
        if(args.userId !== user.id) throw new Error("Action not allowed");
        
        try {
            const updateUserImageQuery = `UPDATE images SET image_image = ${args.image} WHERE user_id = ${user.id}`;
            await mysqlQuery(updateUserImageQuery, context.connection)
    
            const getUserImageQuery = `SELECT image_image FROM images WHERE image_user_id = ${user.id}`;
            return await mysqlQuery(getUserImageQuery, context.connection);
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};
