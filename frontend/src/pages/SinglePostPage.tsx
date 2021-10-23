import React, { useContext } from 'react';
// GraphQL
import { useQuery } from '@apollo/client'
import { GET_COMMENTS_FROM_POSTS, GET_SINGLE_POST } from '../graphql/Queries'
// Interfaces
import { IComment, IPost } from '../Interfaces';
import { Grid, Container, Dimmer, Loader } from 'semantic-ui-react';
// Components
import Comment from '../components/Comment';
import CommentForm from '../components/CommentForm';
// Context
import { GlobalContext } from '../context/GlobalContext';
import PostCard from '../components/PostCard';
// Helpers
import { handleError } from '../helpers/handleError';

type QueryResult = {
    single_post: IPost,
    comments_from_posts: IComment[]
}

export default function SinglePostPage() {
    const { state } = useContext(GlobalContext);

    const postId = window.location.pathname.split('/')[3];

    const { loading, data: post } = useQuery<Pick<QueryResult, "single_post">>(GET_SINGLE_POST, {
        variables: { id: postId },
        onError: (error): unknown => handleError(error, undefined),
    });

    const { data: comments } = useQuery<Pick<QueryResult, "comments_from_posts">>(GET_COMMENTS_FROM_POSTS, {
        variables: { postId },
        onError: (error): unknown => handleError(error, undefined)
    });

    return (
        <Container className="single-post-page__container">
            <Grid className="single-post-page__grid">
                <Grid.Row>
                    {loading ?
                        <Dimmer active={loading} inverted className="home-page__loader">
                            <Loader>Loading...</Loader>
                        </Dimmer> :
                        <Grid.Column width="16">
                            {post?.single_post && <PostCard post={post.single_post} />}
                            {state ? <CommentForm postId={postId} /> : null}
                            <br />
                            <h2>Comments</h2>
                            <br />
                            {comments?.comments_from_posts?.map(c => <Comment key={c.id} comment={c} postId={postId} />)}
                        </Grid.Column>
                    }
                </Grid.Row>
            </Grid>
        </Container>
    )
};