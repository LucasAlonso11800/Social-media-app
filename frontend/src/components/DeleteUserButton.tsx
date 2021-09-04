import React, { useState } from 'react';
// GraphQL
import { useMutation } from '@apollo/client';
import { DELETE_USER } from '../graphql/Mutations';
// Components
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react';

type Props = {
    username: string
};

export default function DeleteUserButton(props: Props) {
    const [open, setOpen] = useState(false);

    const [deleteUser, { error, loading }] = useMutation(DELETE_USER, {
        onCompleted: () => {
            localStorage.removeItem('token');
            window.location.assign('/');
        },
        variables: { username: props.username },
        onError: (): any => console.log(JSON.stringify(error, null, 2))
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