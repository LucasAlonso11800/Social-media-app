import React from 'react';
import { Link } from 'react-router-dom';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_COMMENT_COUNT } from '../graphql/Queries';
// Components
import { Icon, Label, Button, Popup } from 'semantic-ui-react';
// Helpers
import { handleError } from '../helpers/handleError';

type Props = {
    postId: string
    username: string
};

type QueryResult = {
    comment_count: number
};

export default function CommentButton(props: Props) {
    const { postId, username } = props;

    const { data } = useQuery<QueryResult>(GET_COMMENT_COUNT, {
        variables: { postId },
        onError: (error): unknown => handleError(error, undefined)
    });

    return (
        <Popup
            content="Comments"
            inverted
            trigger={
                <Button
                    labelPosition="right"
                    as={window.location.pathname.startsWith('/posts') ? "div" : Link}
                    to={`/posts/${username}/${postId}`}
                >
                    <Button basic as="div" color='twitter'>
                        <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                        {data?.comment_count}
                    </Label>
                </Button >
            }
        />
    )
}