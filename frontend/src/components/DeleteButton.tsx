import React, { useState } from 'react';
// Semantic
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react';
// GraphQL
import { useMutation } from '@apollo/client';
import { DELETE_POST, DELETE_COMMENT } from '../graphql/Mutations';
import { GET_POSTS } from '../graphql/Queries';
import { IPostQuery } from '../Interfaces';

type Props = {
    postId: string,
    commentId?: string,
    callback?: Function
};

function DeleteButton(props: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const { postId, commentId } = props;

    const mutation = commentId ? DELETE_COMMENT : DELETE_POST;

    const [deleteMutation, { error }] = useMutation(mutation, {
        update(proxy) {
            if (!commentId) {
                const data: IPostQuery = proxy.readQuery({
                    query: GET_POSTS
                }) as IPostQuery;

                proxy.writeQuery({
                    query: GET_POSTS,
                    data: { all_posts: data.all_posts.filter(p => p.id !== postId) }
                });
            }
            setOpen(false);
            if (props.callback) props.callback()
        },
        variables: {
            postId,
            commentId
        },
        onError: () => console.log('Error')
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