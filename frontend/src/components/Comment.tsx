import React, { useContext } from 'react'
// Semantic
import { Card } from 'semantic-ui-react';
// Interfaces
import { IComment } from '../Interfaces';
// Context
import { GlobalContext } from '../context/GlobalContext';
// Components
import DeleteButton from './DeleteButton';
import LikeButton from './LikeButton';
// Helpers
import { transformDate } from '../helpers/transformDate';

type Props = {
    comment: IComment;
    postId: string;
}

export default function Comment(props: Props) {
    const { comment, postId } = props;
    const { state } = useContext(GlobalContext);

    const userCanDelete = state && state.username === comment.username;

    return (
        <Card fluid>
            <Card.Content>
                {userCanDelete && <DeleteButton postId={postId} commentId={comment.id} />}
                <Card.Header>{comment.username}</Card.Header>
                <Card.Meta data-testid="commentData">{transformDate(comment.createdAt)}</Card.Meta>
                <Card.Description data-testid="commentBody">{comment.body}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton commentId={comment.id} />
            </Card.Content>
        </Card>
    )
};