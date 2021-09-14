import React, { useState } from 'react';
// GraphQL
import { useMutation } from '@apollo/client';
import { BLOCK_USER } from '../graphql/Mutations';
// Components
import { Button, Icon, Popup } from 'semantic-ui-react';
// Interfaces
import { IBlockStatus } from '../Interfaces';

type Props = {
    blockingUserId: string
    blockedUserId: string
    isBlocking: boolean
    setIsBlocking: Function
};

type MutationResult = {
    block_user: IBlockStatus
};

export default function BlockUserButton(props: Props) {
    const { blockingUserId, blockedUserId, isBlocking, setIsBlocking } = props;

    const [blockUser, { error, loading }] = useMutation<MutationResult>(BLOCK_USER, {
        onCompleted: (data) => setIsBlocking(data.block_user.isBlocking),
        variables: {
            blockingUserId,
            blockedUserId
        },
        onError: (): any => console.log(JSON.stringify(error, null, 2))
    });

    return (
        <Popup
            content={isBlocking ? "Unblock this user" : "Block this user"}
            trigger={
                <Button
                    color={isBlocking ? "teal" : "youtube"}
                    onClick={() => blockUser()}
                    disabled={loading}
                    className={loading ? 'loading' : ''}
                >
                    <Icon name={isBlocking ? "lock open" : "lock"} />
                </Button>
            }
        />
    )
};