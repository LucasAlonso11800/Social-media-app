import React from 'react';
// Interfaces
import { IFollowStatus } from '../Interfaces';

type Props = {
    profileName: string
    bio: string
    followStatus: IFollowStatus | undefined
};

export default function FollowerInfo(props: Props) {
    const { profileName, bio, followStatus } = props;
    console.log(bio, typeof bio)
    return (
        <div className="profile__profile-info">
            {bio !== null && bio !== '' &&
                <p className="profile__profile-name"><b>About {profileName}:</b> {bio}</p>}
            <div className="profile__numbers-container">
                <p className="profile__number">Followers: <b>{followStatus?.followerCount} </b></p>
                <p className="profile__number">Following: <b>{followStatus?.followeeCount} </b></p>
            </div>
        </div>
    )
};
