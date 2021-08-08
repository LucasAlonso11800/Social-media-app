import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
// Semantic
import { Card, Icon, Label, Button, Image, Popup } from 'semantic-ui-react';
import moment from 'moment';
// Context
import { GlobalContext } from '../context/GlobalContext';
// Components
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
// Interfaces
import { IPost } from '../Interfaces';

interface Props {
    post: IPost;
}

function PostCard(props: Props) {
    const { state } = useContext(GlobalContext);
    const { body, createdAt, id, username, comments, likes } = props.post;
    return (
        <Card centered raised fluid>
            <Card.Content>
                <Image
                    floated="right"
                    size="mini"
                    src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description style={{ cursor: "pointer" }} onClick={() => window.location.href = `/posts/${id}`} >
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton likes={likes} id={id} />
                <Popup
                    content="Comment"
                    inverted
                    trigger={
                        <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
                            <Button basic as="div" color='twitter'>
                                <Icon name="comment" />
                            </Button>
                            <Label basic color="blue" pointing="left">
                                {comments.length}
                            </Label>
                        </Button >
                    }
                />
                {state !== null && state.username === username && <DeleteButton postId={id} />}
            </Card.Content>
        </Card>
    )
};

export default PostCard;