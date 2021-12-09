import React, { useContext } from 'react';
// Context
import { GlobalContext } from '../context/GlobalContext';
// Components
import { Button, Icon, Popup } from 'semantic-ui-react';
// GraphQL
import { ApolloCache, useMutation } from '@apollo/client';
import { DELETE_POST, DELETE_COMMENT } from '../graphql/Mutations';
import { GET_COMMENTS_FROM_POSTS, GET_POSTS_FROM_USER } from '../graphql/Queries';
// Interfaces
import { GlobalState, IComment, IPost } from '../Interfaces';
// Helpers
import { handleError } from '../helpers/handleError';

type Props = {
    postId?: string,
    commentId?: string,
};

type QueryResult = {
    posts_from_user: IPost[],
    comments_from_posts: IComment[]
}

export default function DeleteButton(props: Props) {
    const { state, snackbarDispatch } = useContext(GlobalContext);
    const { postId, commentId } = props;

    const mutation = commentId ? DELETE_COMMENT : DELETE_POST;  

    const [deleteMutation] = useMutation(mutation, {
        update(proxy) {
            return commentId ? deleteComment(proxy, postId, commentId) : deletePost(proxy, postId, state);
        },
        variables: {
            postId,
            commentId,
            userId: state?.id
        },
        onError: (error): unknown => handleError(error, snackbarDispatch),
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
                        data-testid="deleteButton"
                    >
                        <Icon name="trash alternate" />
                    </Button>
                }
            />
        </>
    )
};

function deletePost(proxy: ApolloCache<any>, postId: string | undefined, state: GlobalState) {
    const data: Pick<QueryResult, 'posts_from_user'> = proxy.readQuery({
        query: GET_POSTS_FROM_USER,
        variables: { userId: state?.id.toString() }
    }) as Pick<QueryResult, 'posts_from_user'>;
    
    proxy.writeQuery({
        query: GET_POSTS_FROM_USER,
        variables: { userId: state?.id.toString() },
        data: { posts_from_user: data.posts_from_user.filter(p => p.postId !== postId) }
    });
};

function deleteComment(proxy: ApolloCache<any>, postId: string | undefined, commentId: string | undefined): void {
    const data: Pick<QueryResult, 'comments_from_posts'> = proxy.readQuery({
        query: GET_COMMENTS_FROM_POSTS,
        variables: { postId }
    }) as Pick<QueryResult, 'comments_from_posts'>;

    proxy.writeQuery({
        query: GET_COMMENTS_FROM_POSTS,
        variables: { postId },
        data: { comments_from_posts: data.comments_from_posts.filter(c => c.id !== commentId) }
    });
};