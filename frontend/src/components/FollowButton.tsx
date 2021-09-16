import React, { useContext } from 'react';
// GraphQL
import { useMutation } from '@apollo/client';
import { FOLLOW_USER } from '../graphql/Mutations';
// Context 
import { GlobalContext } from '../context/GlobalContext';
// Components
import { Button } from 'semantic-ui-react';
// Interfaces
import { IFollowStatus } from '../Interfaces';
// Helpers
import { handleError } from '../helpers/handleError';

type Props = {
    followeeId: string
    followStatus: IFollowStatus | undefined
    setFollowStatus: Function
};

type MutationResult = {
    follow_user: IFollowStatus
};

export default function FollowButton(props: Props) {
    const { state } = useContext(GlobalContext);
    const { followeeId, followStatus, setFollowStatus } = props;

    const [followUser, { loading }] = useMutation<MutationResult>(FOLLOW_USER, {
        onCompleted: (data) => setFollowStatus(data.follow_user),
        variables: {
            followerId: state?.id,
            followeeId,
        },
        onError: (error): unknown => handleError(error, undefined)
    });

    return (
        <Button
            color="twitter"
            disabled={loading}
            className={loading ? 'loading' : ''}
            onClick={() => {
                if (state) return followUser()
                return window.location.href = '/login'
            }}
        >
            {followStatus?.follows ? 'Unfollow' : 'Follow'}
        </Button>
    )
};