import React, { useState } from 'react';
// Semantic
import { Button, Icon, Confirm } from 'semantic-ui-react';
// GraphQL
import { useMutation } from '@apollo/client';
import { DELETE_POST } from '../graphql/Mutations';
import { GET_POSTS } from '../graphql/Queries';
import { IPostQuery } from '../Interfaces';

type Props = {
    id: string,
    callback?: Function
};

function DeleteButton(props: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const [deletePost, { error }] = useMutation(DELETE_POST, {
        update(proxy) {
            const data: IPostQuery = proxy.readQuery({
                query: GET_POSTS
            }) as IPostQuery;

            proxy.writeQuery({
                query: GET_POSTS,
                data: { all_posts: data.all_posts.filter(p => p.id !== props.id) }
            });
            setOpen(false);
            if (props.callback) props.callback()
        },
        variables: {
            postId: props.id,
        },
        onError: () => console.log('Error')
    });

    return (
        <>
            <Button as="div" color='red' floated="right" onClick={() => setOpen(true)}>
                <Icon name="trash alternate" />
            </Button>
            <Confirm
                open={open}
                onCancel={() => setOpen(false)}
                onConfirm={() => deletePost()}
            />
        </>
    )
};

export default DeleteButton;