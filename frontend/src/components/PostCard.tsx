import React from 'react'
import { Card, Icon, Label, Button } from 'semantic-ui-react';
import moment from 'moment';
import { IPost } from '../Interfaces';

type Props = {
    post: IPost;
}

function PostCard(props: Props) {
    const { body, createdAt, id, username, comments, likes } = props.post;
    return (
        <Card>
            <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button as="div" labelPosition="right">
                    <Button as="div" color='twitter' basic>
                        <Icon name="heart" />
                    </Button>
                    <Label basic color="teal" pointing="left">
                        {likes.length}
                    </Label>
                </Button >
                <Button as="div" labelPosition="right">
                    <Button basic as="div" color='twitter'>
                        <Icon name="comment" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                        {comments.length}
                    </Label>
                </Button >
            </Card.Content>
        </Card>
    )
};

export default PostCard;