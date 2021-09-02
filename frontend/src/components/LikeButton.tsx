import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
// GraphQL
import { useMutation } from '@apollo/client';
import { LIKE_POST } from '../graphql/Mutations';
// Context
import { GlobalContext } from '../context/GlobalContext';
// Semantic
import { Icon, Label, Button, Popup } from 'semantic-ui-react';
// Interfaces
import { ILike } from '../Interfaces';

type Props = {
    likes: ILike[],
    id: string;
}

function LikeButton(props: Props) {
    const [liked, setLiked] = useState<boolean>(false)
    const { state } = useContext(GlobalContext);
    const { likes, id } = props;

    const [likeCount, setLikeCount] = useState(likes.length)

    useEffect(() => {
        const userHasLikedThePost = state !== null && likes.find(like => like.username === state.username)
        userHasLikedThePost ? setLiked(true) : setLiked(false)
    }, [state, likes]);

    const [likePost] = useMutation(LIKE_POST, {
        onCompleted: () => {
            liked ? setLikeCount(likeCount - 1) : setLikeCount(likeCount + 1)
            setLiked(!liked)
        },
        variables: { postId: id }
    });

    return (
        <Popup
            content="Like"
            inverted
            trigger={
                <Button as="div" labelPosition="right" onClick={state !== null ? () => likePost() : () => { }}>
                    <Button color='twitter' basic={!liked} as={state !== null ? "div" : Link} to="/login">
                        <Icon name="heart" />
                    </Button>
                    <Label basic color="teal" pointing="left">
                        {likeCount}
                    </Label>
                </Button >
            }
        />
    )
}

export default LikeButton
