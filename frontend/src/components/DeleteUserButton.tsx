import React, { useState } from 'react';
// GraphQL
import { useMutation } from '@apollo/client';
import { DELETE_USER } from '../graphql/Mutations';
// Components
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react';
// Interfaces   
import { SnackbarActions } from '../Interfaces';
// Helpers
import { handleError } from '../helpers/handleError';

type Props = {
    userId: string
    snackbarDispatch:  React.Dispatch<SnackbarActions>
};

export default function DeleteUserButton(props: Props) {
    const { userId, snackbarDispatch } = props;
    const [open, setOpen] = useState<boolean>(false);

    const [deleteUser, { loading }] = useMutation(DELETE_USER, {
        onCompleted: () => {
            localStorage.removeItem('token');
            window.location.assign('/');
        },
        variables: { id: userId },
        onError: (error): unknown => handleError(error, snackbarDispatch)
    });

    return (
        <>
            <Popup
                content="Delete your account"
                inverted
                trigger={
                    <Button as="div" color="youtube" onClick={() => setOpen(true)}>
                        <Icon name="trash alternate" disabled={loading} />
                    </Button>
                }
            />
            <Confirm
                open={open}
                content="Do you want to delete your account? You won't be able to recover it afterwards and all your posts and comments will also be lost."
                onCancel={() => setOpen(false)}
                onConfirm={() => deleteUser()}
            />
        </>
    )
};