import React, { useContext } from 'react'
// Semantic
import { Card } from 'semantic-ui-react';
// Interfaces
import { IComment } from '../Interfaces';
import moment from 'moment';
// Context
import { GlobalContext } from '../context/GlobalContext';
// Components
import DeleteButton from './DeleteButton';

type Props = {
    comment: IComment;
    postId: string;
}

function Comment(props: Props) {
    const { comment, postId } = props;
    const { state } = useContext(GlobalContext);

    return (
        <Card fluid>
            <Card.Content>
                {state && state.username === comment.username && <DeleteButton postId={postId} commentId={comment.id}/>}
                <Card.Header>{comment.username}</Card.Header>
                <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                <Card.Description>{comment.body}</Card.Description>
            </Card.Content>
        </Card>
    )
};

export default Comment;