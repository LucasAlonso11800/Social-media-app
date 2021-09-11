import { GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { JwtPayload } from "jsonwebtoken";
// Helpers
import checkAuth from "../../Helpers/CheckAuth";
import { mysqlQuery } from "../../Helpers/MySQLPromise";
// Types
import { IContext, IImage } from "../../Interfaces";

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
        if(args.userId !== user.id) throw new Error("Action not allowed");
        
        try {
            const updateUserImageQuery = `UPDATE images SET image_image = "${args.image}" WHERE image_user_id = ${args.userId}`;
            await mysqlQuery(updateUserImageQuery, context.connection)
    
            const getUserImageQuery = `SELECT image_image FROM images WHERE image_user_id = ${args.userId}`;
            const response: IImage[] = await mysqlQuery(getUserImageQuery, context.connection)
            
            return response[0].image_image
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};
