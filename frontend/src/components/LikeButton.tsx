import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
// GraphQL
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_POST_OR_COMMENT } from '../graphql/Mutations';
import { GET_LIKE_STATUS } from '../graphql/Queries';
// Context
import { GlobalContext } from '../context/GlobalContext';
// Components
import { Icon, Label, Button, Popup } from 'semantic-ui-react';
// Interfaces
import { ILikeStatus } from '../Interfaces';
// Helpers
import { handleError } from '../helpers/handleError';

type Props = {
    postId?: string
    commentId?: string
};

type QueryResult = {
    like_status: ILikeStatus
};

export default function LikeButton(props: Props) {
    const { postId, commentId } = props;
    const { state } = useContext(GlobalContext);
    const [likeStatus, setLikeStatus] = useState<ILikeStatus>();

    useQuery(GET_LIKE_STATUS, {
        onCompleted: (data: QueryResult) => setLikeStatus(data.like_status),
        variables: {
            postId,
            commentId,
            userId: state !== null ? state.id : null,
            type: postId ? "P" : "C"
        },
        onError: (error): unknown => handleError(error, undefined)
    });

    const [likePost, { loading }] = useMutation(LIKE_POST_OR_COMMENT, {
        onCompleted: (data) => {
            const newLikeStatus: ILikeStatus = {
                count: data.like_post_or_comment.count,
                liked: data.like_post_or_comment.liked
            };
            setLikeStatus(newLikeStatus);
        },
        variables: {
            postId,
            commentId,
            type: postId ? "P" : "C"
        },
        onError: (error): unknown => handleError(error, undefined)
    });

    return (
        <Popup
            content="Like"
            inverted
            trigger={
                <Button
                    as="div"
                    labelPosition="right"
                    onClick={state !== null ? () => likePost() : () => { }}
                    className={loading ? 'loading' : ''}
                >
                    <Button
                        color='twitter'
                        basic={!likeStatus?.liked}
                        as={state !== null ? "div" : Link}
                        to="/login"
                        data-testid="likeButton"
                    >
                        <Icon name="heart" />
                    </Button>
                    <Label basic color="teal" pointing="left" data-testid="likeButtonCount">
                        {likeStatus?.count}
                    </Label>
                </Button >
            }
        />
    )
}