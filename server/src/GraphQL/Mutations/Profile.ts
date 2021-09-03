import { GraphQLString, GraphQLNonNull } from 'graphql';
import { IContext, IAddProfile, IEditProfile, IProfile } from '../../Interfaces';
import { ProfileType } from '../Types/ProfileType';
import checkAuth from "../../Helpers/CheckAuth";
import { JwtPayload } from 'jsonwebtoken';
import Profile from '../../Models/Profile';

export const ADD_PROFILE = {
    type: ProfileType,
    args: {
        profileName: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(_: any, args: IAddProfile) {
        const { userId, profileName } = args;

        const newProfile = new Profile({
            profileName, bio: '', profileImage: '', user: userId
        });

        try {
            const profile: IProfile[] = await Profile.insertMany(newProfile)
            return profile[0]
        }
        catch (err: any) {
            throw new Error(err)
        }
    }
};

export const EDIT_PROFILE = {
    type: ProfileType,
    args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        profileName: { type: new GraphQLNonNull(GraphQLString) },
        profileImage: { type: GraphQLString },
        bio: { type: new GraphQLNonNull(GraphQLString) },
    },
    async resolve(_: any, args: IEditProfile, context: IContext) {
        const user = checkAuth(context) as JwtPayload;

        const { userId, profileName, profileImage, bio } = args;

        try {
            const profile: IProfile = await Profile.findOne({ user: userId });
            if (profile.user.toString() !== user.id) throw new Error("Action not allowed");

            const newProfile: IProfile = await Profile.findOneAndUpdate({ _id: profile._id }, {
                profileName, bio, profileImage, user: user.id
            }, { new: true });

            return {
                id: newProfile._id,
                profileName: newProfile.profileName,
                profileImage: newProfile.profileImage,
                bio: newProfile.bio,
            }
        }
        catch (err: any) {
            throw new Error(err);
        }
    }
};