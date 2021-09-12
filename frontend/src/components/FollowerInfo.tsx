import React from 'react';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_USER_FOLLOW_COUNT } from '../graphql/Queries';
// Components
import { Card } from 'semantic-ui-react';
// Interfaces
import { IFollowCount } from '../Interfaces';

type Props = {
    profileName: string
    bio: string
    userId: string
};

type QueryResult = {
    user_follow_count: IFollowCount
};

export default function FollowerInfo(props: Props) {
    const { profileName, bio, userId } = props;

    const { error, loading, data } = useQuery<QueryResult>(GET_USER_FOLLOW_COUNT, {
        variables: { userId },
        onError: (): any => console.log(JSON.stringify(error, null, 2))
    });

    return (
        <div className="profile__profile-info">
            <Card.Description><b>About {profileName}:</b> {bio}</Card.Description>
            <div className="profile__numbers-container">
                <p className="profile__number">Followers: <b>{data?.user_follow_count.followerCount} </b></p>
                <p className="profile__number">Following: <b>{data?.user_follow_count.followingCount} </b></p>
            </div>
        </div>
    )
};
