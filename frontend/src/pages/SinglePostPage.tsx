import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router';
// GraphQL
import { useQuery } from '@apollo/client'
import { GET_SINGLE_POST } from '../graphql/Queries'
// Interfaces
import { ISinglePostQuery } from '../Interfaces';
import { Grid, Container, Dimmer, Loader } from 'semantic-ui-react';
// Components
import Comment from '../components/Comment';
import CommentForm from '../components/CommentForm';
// Context
import { GlobalContext } from '../context/GlobalContext';
import PostCard from '../components/PostCard';

export default function SinglePostPage(props: RouteComponentProps) {
    const { state } = useContext(GlobalContext);

    const postId = window.location.pathname.split('/')[3];

    const { error, loading, data: post } = useQuery<ISinglePostQuery>(GET_SINGLE_POST, { variables: { id: postId } });

    if (error) {
        if (error.message === "Error: Post not found" || /CastError: Cast to ObjectId failed/.test(error.message)) {
            window.location.assign('/404')
        }
    };

    return (
        <Container>
            <Grid>
                <Grid.Row>
                    {loading ?
                        <Dimmer active={loading} inverted className="home-page__loader">
                            <Loader>Loading...</Loader>
                        </Dimmer> :
                        <Grid.Column width="16">
                            {post?.single_post && <PostCard post={post.single_post} />}
                            {state ? <CommentForm postId={postId} /> : null}
                            {post?.single_post.comments.map(c => <Comment key={c.id} comment={c} postId={post?.single_post.id} />)}
                        </Grid.Column>
                    }
                </Grid.Row>
            </Grid>
        </Container>
    )
};