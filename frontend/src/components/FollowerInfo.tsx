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

    const profileHasBio = bio !== null && bio !== '';

    return (
        <div className="profile__profile-info">
            {profileHasBio && <p className="profile__profile-name" data-testid="profileDescription"><b>About {profileName}:</b> {bio}</p>}
            <div className="profile__numbers-container">
                <p className="profile__number" data-testid="followerNumber">Followers: <b>{followStatus?.followerCount} </b></p>
                <p className="profile__number" data-testid="followingNumber">Following: <b>{followStatus?.followeeCount} </b></p>
            </div>
        </div>
    )
};
