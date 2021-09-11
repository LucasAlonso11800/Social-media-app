import React, { useContext } from 'react';
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
import { ILikeStatusQuery } from '../Interfaces';

type Props = {
    postId?: string
    commentId?: string
}

export default function LikeButton(props: Props) {
    const { postId, commentId } = props;
    const { state } = useContext(GlobalContext);

    const { error, data } = useQuery<ILikeStatusQuery>(GET_LIKE_STATUS, {
        variables: {
            postId,
            commentId,
            userId: state !== null ? state.id : null,
            type: postId ? "P" : "C" 
        },
        onError: (): any => console.log(JSON.stringify(error, null, 2))
    });

    const [likePost] = useMutation(LIKE_POST_OR_COMMENT, {
        onCompleted: (data) => {
            console.log(data)
        },
        variables: {
            postId,
            commentId,
            type: postId ? "P" : "C"         
        }
    });

    return (
        <Popup
            content="Like"
            inverted
            trigger={
                <Button as="div" labelPosition="right" onClick={state !== null ? () => likePost() : () => { }}>
                    <Button color='twitter' basic={!data?.like_status.liked} as={state !== null ? "div" : Link} to="/login">
                        <Icon name="heart" />
                    </Button>
                    <Label basic color="teal" pointing="left">
                        {data?.like_status.count}
                    </Label>
                </Button >
            }
        />
    )
}