import { GraphQLID, GraphQLNonNull } from 'graphql';
// Types
import { ProfileType } from '../Types/ProfileType';
import { IContext, IGetProfile, IProfile } from '../../Interfaces';
// Helpers
import { mysqlQuery } from '../../Helpers/MySQLPromise';

export const GET_PROFILE = {
    type: ProfileType,
    args: {
        userId: { type: new GraphQLNonNull(GraphQLID) }
    },
    async resolve(_: any, args: IGetProfile, context: IContext) {
        const { userId } = args

        try {
            const getProfileQuery = `
                SELECT 
                    profile_id AS id,
                    profile_profile_name AS profileName,
                    profile_profile_description AS bio,
                    image_image AS profileImage,
                    user_username AS username,
                    user_city AS city,
                    user_country AS country,
                    user_birth_date AS birthDate
                    FROM profiles 
                    JOIN images 
                    ON images.image_profile_id = profile_id
                    JOIN users
                    ON users.user_id = profile_user_id
                    WHERE profile_user_id = ${userId}
            `;
            const response: IProfile[] = await mysqlQuery(getProfileQuery, context.connection)

            if(response[0]) return response[0];
            throw new Error("User not found");
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};