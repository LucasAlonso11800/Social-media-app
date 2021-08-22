import React, { useState } from 'react';
// GraphQL
import { useMutation } from '@apollo/client';
import { BLOCK_USER } from '../graphql/Mutations';
// Components
import { Button, Icon, Popup } from 'semantic-ui-react';
// Interfaces
import { IBlockUserQuery, IProfile } from '../Interfaces';

type Props = {
    profile: IProfile
    userIsBlocked: boolean
};

export default function BlockUserButton(props: Props) {
    const { profile, userIsBlocked } = props;
    const [isBlocked, setIsBlocked] = useState(userIsBlocked);

    const [blockUser, { error, loading }] = useMutation(BLOCK_USER, {
        onCompleted: (data: IBlockUserQuery) => {
            const isBlockedNow = data.block_user.blockedUsers.find(u => u.username === profile.user.username)
            setIsBlocked(isBlockedNow ? true : false);
        },
        variables: { blockedUsername: profile.user.username },
        onError: (): any => console.log(JSON.stringify(error, null, 2))
    });

    return (
        <Popup
            content={isBlocked ? "Unblock this user" : "Block this user"}
            trigger={
                <Button color={isBlocked ? "teal" : "youtube"} onClick={() => blockUser()} disabled={loading} className={loading ? 'loading' : ''}>
                    <Icon name={isBlocked ? "lock open" : "lock"} />
                </Button>
            }
        />
    )
};