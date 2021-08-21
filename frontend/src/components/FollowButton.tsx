import React, { useState, useContext } from 'react';
// GraphQL
import { useMutation } from '@apollo/client';
import { FOLLOW_USER } from '../graphql/Mutations';
// Context 
import { GlobalContext } from '../context/GlobalContext';
// Components
import { Button } from 'semantic-ui-react';
// Interfaces
import { IFollower } from '../Interfaces';

type Props = {
    followsUser: IFollower | undefined
    followedUser: {
        image: string
        username: string
    }
};

export default function FollowButton(props: Props) {
    const { state } = useContext(GlobalContext);
    const { followsUser, followedUser } = props;
    const [follows, setFollows] = useState(followsUser ? true : false);

    const [followUser, { error, loading, data }] = useMutation(FOLLOW_USER, {
        update() {
            const isFollowingNow = data.follow_user.following.find((f: IFollower) => f.username === followedUser.username);
            setFollows(isFollowingNow ? true : false);
        },
        variables: {
            followingUsername: state?.username,
            followedUsername: followedUser.username,
            followingImage: '',
            followedImage: '',
        },
        onError: (): any => console.log(error, JSON.stringify(error, null, 2))
    });

    return (
        <Button color="twitter" disabled={loading}
            onClick={() => {
                if (state) return followUser()
                return window.location.href = '/login'
            }}>
            {follows ? 'Unfollow' : 'Follow'}
        </Button>
    )
};