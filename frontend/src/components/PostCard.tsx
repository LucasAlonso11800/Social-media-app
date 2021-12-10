import React, { useContext } from 'react'
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
import { getBase64ImageSrc } from '../helpers/getBase64ImageSrc';
import { transformDate } from '../helpers/transformDate';

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

    const userCanDelete = state !== null && state.username === username && window.location.pathname.startsWith('/user/');

    const imageSrc = image?.user_image ? getBase64ImageSrc(image?.user_image) : ProfilePlaceholder;

    return (
        <Card centered raised fluid>
            <Card.Content>
                <Image
                    floated="right"
                    className="post__user-image"
                    src={imageSrc}
                    onClick={() => window.location.assign(`/user/${userId}`)}
                />
                <Card.Header
                    style={{ cursor: "pointer" }}
                    onClick={() => window.location.assign(`/user/${userId}`)}
                    data-testid="postUser"
                >
                    {profileName}
                </Card.Header>
                <Card.Meta data-testid="postData">{username} - {transformDate(createdAt)}</Card.Meta>
                <Card.Description
                    style={{ cursor: "pointer" }}
                    onClick={() => window.location.assign(`/posts/${username}/${postId}`)}
                    data-testid="postBody"
                >
                    {body}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton postId={postId} />
                <CommentButton postId={postId} username={username} />
                {userCanDelete && <DeleteButton postId={postId} />}
            </Card.Content>
        </Card>
    )
};