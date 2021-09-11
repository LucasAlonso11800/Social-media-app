import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_USER_IMAGE } from '../graphql/Queries';
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
import CommentButton from './CommentButton';

type Props = {
    post: IPost;
};

export default function PostCard(props: Props) {
    const { state } = useContext(GlobalContext);
    const { body, createdAt, postId, username, userId, profileName } = props.post;

    const { error: imageError, data: image } = useQuery<{ user_image: string }>(GET_USER_IMAGE, {
        variables: { userId },
        onError: (): any => console.log(JSON.stringify(imageError, null, 2))
    });

    return (
        <Card centered raised fluid>
            <Card.Content>
                <Image
                    floated="right"
                    className="post__user-image"
                    src={image?.user_image ? `data:image/png;base64,${image?.user_image}` : ProfilePlaceholder}
                    onClick={() => window.location.href = `/user/${userId}`}
                />
                <Card.Header style={{ cursor: "pointer" }} onClick={() => window.location.href = `/user/${userId}`} >{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description style={{ cursor: "pointer" }} onClick={() => window.location.href = `/posts/${username}/${postId}`} >
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton postId={postId} />
                <CommentButton postId={postId} username={username}/>
                {state !== null && state.username === username && window.location.pathname.startsWith('/user/') && <DeleteButton postId={postId} />}
            </Card.Content>
        </Card>
    )
};