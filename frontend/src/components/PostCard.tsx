import React, { useContext } from 'react'
import moment from 'moment';
// Context
import { GlobalContext } from '../context/GlobalContext';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_USER_IMAGE } from '../graphql/Queries';
// Components
import { Card, Image } from 'semantic-ui-react';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import ProfilePlaceholder from '../assets/ProfilePlaceholder.png';
// Interfaces
import { IPost } from '../Interfaces';
import CommentButton from './CommentButton';
// Helpers
import { handleError } from '../helpers/handleError';

type Props = {
    post: IPost;
};

export default function PostCard(props: Props) {
    const { state } = useContext(GlobalContext);
    const { body, createdAt, postId, username, userId, profileName } = props.post;

    const { data: image } = useQuery<{ user_image: string }>(GET_USER_IMAGE, {
        variables: { userId },
        onError: (error): unknown => handleError(error, undefined)
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