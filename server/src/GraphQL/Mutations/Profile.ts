import { GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql';
import { JwtPayload } from 'jsonwebtoken';
// Types
import { ProfileType } from '../Types/ProfileType';
import { IContext, IEditProfile, IProfile } from '../../Interfaces';
// Helpers
import checkAuth from "../../Helpers/CheckAuth";
import validateProfile from '../../Helpers/EditProfileValidation';
import { mysqlQuery } from '../../Helpers/MySQLPromise';

export const EDIT_PROFILE = {
    type: ProfileType,
    args: {
        profileId: { type: new GraphQLNonNull(GraphQLID) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
        profileName: { type: new GraphQLNonNull(GraphQLString) },
        profileImage: { type: GraphQLString },
        bio: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(_: any, args: IEditProfile, context: IContext) {
        const user = checkAuth(context) as JwtPayload;
        const { profileId, userId, profileName, profileImage, bio } = args;

        if (userId !== user.id) throw new Error("Action not allowed");

        validateProfile(profileName, bio);

        try {
            const updateProfileQuery = `UPDATE profiles 
                SET profile_profile_name = "${profileName}",
                    profile_profile_description = "${bio}"
                WHERE profile_id = ${profileId}
            `;
            await mysqlQuery(updateProfileQuery, context.connection);

            if (profileImage !== null) {
                const updateProfileImageQuery = `UPDATE images
                    SET image_image = "${profileImage}"
                    WHERE image_profile_id = ${profileId}
                `;
                await mysqlQuery(updateProfileImageQuery, context.connection);
            }
            const getProfileQuery = `SELECT 
                profile_id AS id, 
                profile_user_id AS userId, 
                profile_profile_name AS profileName, 
                profile_profile_description AS bio,
                image_image AS profileImage
                FROM profiles
                JOIN images
                ON profile_id = images.image_profile_id
                WHERE profile_id = ${profileId}
            `;
            
            const response: IProfile[] = await mysqlQuery(getProfileQuery, context.connection); 
            return response[0]
        }
        catch (err: any) {
            throw new Error(err);
        }
    }
};