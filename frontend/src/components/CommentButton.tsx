import React from 'react';
import { Link } from 'react-router-dom';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_COMMENT_COUNT } from '../graphql/Queries';
// Semantic
import { Icon, Label, Button, Popup } from 'semantic-ui-react';
// Interfaces
import { ICommentCountQuery, ILikeStatusQuery } from '../Interfaces';

type Props = {
    postId: string
    username: string
}

export default function CommentButton(props: Props) {
    const { postId, username } = props;

    const { error, data } = useQuery<ICommentCountQuery>(GET_COMMENT_COUNT, {
        variables: { postId },
        onError: (): any => console.log(JSON.stringify(error, null, 2))
    });

    return (
        <Popup
            content="Comment"
            inverted
            trigger={
                <Button labelPosition="right" as={Link} to={`/posts/${username}/${postId}`}>
                    <Button basic as="div" color='twitter'>
                        <Icon name="comment" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                        {data?.comment_count}
                    </Label>
                </Button >
            }
        />
    )
}