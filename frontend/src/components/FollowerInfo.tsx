import React from 'react';
// Components
import { Card } from 'semantic-ui-react';
// Interfaces
import { IFollowStatus } from '../Interfaces';

type Props = {
    profileName: string
    bio: string
    followStatus: IFollowStatus | undefined
};

export default function FollowerInfo(props: Props) {
    const { profileName, bio, followStatus } = props;

    return (
        <div className="profile__profile-info">
            <Card.Description><b>About {profileName}:</b> {bio}</Card.Description>
            <div className="profile__numbers-container">
                <p className="profile__number">Followers: <b>{followStatus?.followerCount} </b></p>
                <p className="profile__number">Following: <b>{followStatus?.followeeCount} </b></p>
            </div>
        </div>
    )
};
