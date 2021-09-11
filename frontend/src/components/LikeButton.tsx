import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
// GraphQL
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_POST_OR_COMMENT } from '../graphql/Mutations';
import { GET_LIKE_STATUS } from '../graphql/Queries';
// Context
import { GlobalContext } from '../context/GlobalContext';
// Semantic
import { Icon, Label, Button, Popup } from 'semantic-ui-react';
// Interfaces
import { ILikeStatus, ILikeStatusQuery } from '../Interfaces';

type Props = {
    postId?: string
    commentId?: string
}

export default function LikeButton(props: Props) {
    const { postId, commentId } = props;
    const { state } = useContext(GlobalContext);
    const [likeStatus, setLikeStatus] = useState<ILikeStatus>();

    const { error } = useQuery(GET_LIKE_STATUS, {
        onCompleted: (data: ILikeStatusQuery) => {
            setLikeStatus(data.like_status)
        },
        variables: {
            postId,
            commentId,
            userId: state !== null ? state.id : null,
            type: postId ? "P" : "C"
        },
        onError: (): any => console.log(JSON.stringify(error, null, 2))
    });

    const [likePost, { loading, error: likeError }] = useMutation(LIKE_POST_OR_COMMENT, {
        onCompleted: (data) => {
            const newLikeStatus: ILikeStatus = {
                count: data.like_post_or_comment.count,
                liked: data.like_post_or_comment.liked
            }
            setLikeStatus(newLikeStatus)
        },
        variables: {
            postId,
            commentId,
            type: postId ? "P" : "C"
        },
        onError: (): any => console.log(JSON.stringify(likeError, null, 2))
    });

    return (
        <Popup
            content="Like"
            inverted
            trigger={
                <Button as="div" labelPosition="right" onClick={state !== null ? () => likePost() : () => { }} className={loading ? 'loading' : ''}>
                    <Button color='twitter' basic={!likeStatus?.liked} as={state !== null ? "div" : Link} to="/login">
                        <Icon name="heart" />
                    </Button>
                    <Label basic color="teal" pointing="left">
                        {likeStatus?.count}
                    </Label>
                </Button >
            }
        />
    )
}