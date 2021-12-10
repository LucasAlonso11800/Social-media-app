import React from 'react';
// GraphQL
import { useMutation } from '@apollo/client';
import { BLOCK_USER } from '../graphql/Mutations';
// Components
import { Button, Icon, Popup } from 'semantic-ui-react';
// Interfaces
import { IBlockStatus } from '../Interfaces';
// Helpers
import { handleError } from '../helpers/handleError';

type Props = {
    blockingUserId: number
    blockedUserId: string
    isBlocking: boolean
    setIsBlocking: React.Dispatch<React.SetStateAction<boolean>>
};

type MutationResult = {
    block_user: IBlockStatus
};

export default function BlockUserButton(props: Props) {
    const { blockingUserId, blockedUserId, isBlocking, setIsBlocking } = props;

    const [blockUser, { loading }] = useMutation<MutationResult>(BLOCK_USER, {
        onCompleted: (data) => setIsBlocking(data.block_user.isBlocking),
        variables: {
            blockingUserId,
            blockedUserId
        },
        onError: (error): unknown => handleError(error, undefined)
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
                    data-testid="blockUserButton"
                >
                    <Icon name={isBlocking ? "lock open" : "lock"} data-testid="blockUserIcon" />
                </Button>
            }
        />
    )
};