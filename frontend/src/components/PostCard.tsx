import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
// Semantic
import { Card, Icon, Label, Button } from 'semantic-ui-react';
import moment from 'moment';
// Context
import { GlobalContext } from '../context/GlobalContext';
// Components
import LikeButton from './LikeButton';
// Interfaces
import { IPost } from '../Interfaces';

type Props = {
    post: IPost;
}

function PostCard(props: Props) {
    const { state } = useContext(GlobalContext);
    const { body, createdAt, id, username, comments, likes } = props.post;
    return (
        <Card centered raised fluid>
            <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton likes={likes} id={id}/>
                <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
                    <Button basic as="div" color='twitter'>
                        <Icon name="comment" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                        {comments.length}
                    </Label>
                </Button >
                {state !== null && state.username === username ?
                    <Button as="div" color='red' floated="right">
                        <Icon name="trash alternate" />
                    </Button>
                    : null}
            </Card.Content>
        </Card>
    )
};

export default PostCard;