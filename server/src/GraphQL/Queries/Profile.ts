// import { GraphQLNonNull, GraphQLString } from 'graphql';
// import { IGetProfile, IProfile, IUser } from '../../Interfaces';
// import Profile from '../../Models/Profile';
// import User from '../../Models/User';
// import { ProfileType } from '../Types/ProfileType';

// export const GET_PROFILE = {
//     type: ProfileType,
//     args: {
//         username: { type: new GraphQLNonNull(GraphQLString) }
//     },
//     async resolve(_: any, args: IGetProfile) {
//         const { username } = args

//         try {
//             const user: IUser = await User.findOne({ username });
//             if (!user) throw new Error('User not found');

//             const profile: IProfile = await Profile.findOne({ user: user._id }).populate('user')
//             if (!profile) throw new Error('Profile not found');

//             const { _id, profileName, profileImage, bio } = profile;

//             return {
//                 id: _id,
//                 profileName,
//                 profileImage,
//                 bio,
//                 user: profile.user
//             }
//         }
//         catch (err: any) {
//             throw new Error(err)
//         }
//     }
// };