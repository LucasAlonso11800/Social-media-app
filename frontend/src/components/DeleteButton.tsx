import React, { useState } from 'react';
// Semantic
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react';
// GraphQL
import { useMutation } from '@apollo/client';
import { DELETE_POST, DELETE_COMMENT } from '../graphql/Mutations';
import { GET_POSTS_FROM_USER } from '../graphql/Queries';
import { IPostsFromUserQuery } from '../Interfaces';

type Props = {
    postId: string,
    commentId?: string,
};

function DeleteButton(props: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const { postId, commentId } = props;

    const mutation = commentId ? DELETE_COMMENT : DELETE_POST;

    const username = window.location.pathname.substring(6).replaceAll('%20', ' ');

    const [deleteMutation, { error }] = useMutation(mutation, {
        update(proxy) {
            if (!commentId) {
                const data: IPostsFromUserQuery = proxy.readQuery({
                    query: GET_POSTS_FROM_USER,
                    variables: { username }
                }) as IPostsFromUserQuery;

                proxy.writeQuery({
                    query: GET_POSTS_FROM_USER,
                    variables: { username },
                    data: { posts_from_user: data.posts_from_user.filter(p => p.id !== postId) }
                });
            }
            setOpen(false);
        },
        variables: {
            postId,
            commentId
        },
        onError: (): any => console.log(JSON.stringify(error, null, 2)),
    });

    return (
        <>
            <Popup
                content={commentId ? "Delete comment" : "Delete post"}
                inverted
                trigger={
                    <Button
                        as="div"
                        color='red'
                        floated="right"
                        onClick={() => setOpen(true)}
                    >
                        <Icon name="trash alternate" />
                    </Button>
                }
            />
            <Confirm
                open={open}
                onCancel={() => setOpen(false)}
                onConfirm={() => deleteMutation()}
            />
        </>
    )
};

export default DeleteButton;