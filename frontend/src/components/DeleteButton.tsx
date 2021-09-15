import React, { useContext } from 'react';
// Context
import { GlobalContext } from '../context/GlobalContext';
// Components
import { Button, Icon, Popup } from 'semantic-ui-react';
// GraphQL
import { useMutation } from '@apollo/client';
import { DELETE_POST, DELETE_COMMENT } from '../graphql/Mutations';
import { GET_COMMENTS_FROM_POSTS, GET_POSTS_FROM_USER } from '../graphql/Queries';
// Interfaces
import { IComment, IPost } from '../Interfaces';

type Props = {
    postId?: string,
    commentId?: string,
};

type QueryResult = {
    posts_from_user: IPost[],
    comments_from_posts: IComment[]
}

export default function DeleteButton(props: Props) {
    const { state } = useContext(GlobalContext);
    const { postId, commentId } = props;

    const mutation = commentId ? DELETE_COMMENT : DELETE_POST;

    const [deleteMutation, { error }] = useMutation(mutation, {
        update(proxy) {
            if (!commentId) {
                const data: Pick<QueryResult, 'posts_from_user'> = proxy.readQuery({
                    query: GET_POSTS_FROM_USER,
                    variables: { userId: state?.id }
                }) as Pick<QueryResult, 'posts_from_user'>;

                proxy.writeQuery({
                    query: GET_POSTS_FROM_USER,
                    variables: { userId: state?.id },
                    data: { posts_from_user: data.posts_from_user.filter(p => p.postId !== postId) }
                });
            }
            else {
                const data: Pick<QueryResult, 'comments_from_posts'> = proxy.readQuery({
                    query: GET_COMMENTS_FROM_POSTS,
                    variables: { postId }
                }) as Pick<QueryResult, 'comments_from_posts'>;

                proxy.writeQuery({
                    query: GET_COMMENTS_FROM_POSTS,
                    variables: { postId },
                    data: { comments_from_posts: data.comments_from_posts.filter(c => c.id !== commentId) }
                });
            }
        },
        variables: {
            postId,
            commentId,
            userId: state?.id
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
                        onClick={() => deleteMutation()}
                    >
                        <Icon name="trash alternate" />
                    </Button>
                }
            />
        </>
    )
};