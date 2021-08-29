import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
// GraphQL
import { useQuery } from '@apollo/client';
// Semantic
import { Card, Icon, Label, Button, Image, Popup } from 'semantic-ui-react';
import moment from 'moment';
// Context
import { GlobalContext } from '../context/GlobalContext';
// Components
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import ProfilePlaceholder from '../assets/ProfilePlaceholder.png';
// Interfaces
import { IPost } from '../Interfaces';
import { GET_USER_IMAGE } from '../graphql/Queries';

interface Props {
    post: IPost;
}

function PostCard(props: Props) {
    const { state } = useContext(GlobalContext);
    const { body, createdAt, id, username, comments, likes } = props.post;

    const { error, loading, data } = useQuery(GET_USER_IMAGE, {
        variables: { username }
    });

    return (
        <Card centered raised fluid>
            <Card.Content>
                <Image
                    floated="right"
                    className={loading ? 'loading' : "post__user-image"}
                    src={data?.user_image.image ? `data:image/png;base64,${data?.user_image.image}` : ProfilePlaceholder}
                    onClick={() => window.location.href = `/user/${username}`}
                />
                <Card.Header style={{ cursor: "pointer" }} onClick={() => window.location.href = `/user/${username}`} >{username}</Card.Header>
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