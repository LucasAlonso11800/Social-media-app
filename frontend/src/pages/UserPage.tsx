import React, { useContext, useState } from 'react';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_POSTS_FROM_USER } from '../graphql/Queries';
// Context
import { GlobalContext } from '../context/GlobalContext';
// Interfaces
import { IPost } from '../Interfaces';
// Components
import { Grid, Container, CardGroup, Dimmer, Loader } from 'semantic-ui-react';
import PostCard from '../components/PostCard';
import Profile from '../components/Profile';
import PostForm from '../components/PostForm';
// Helpers
import { handleError } from '../helpers/handleError';

type QueryResult = {
    posts_from_user: IPost[]
};

export default function UserPage() {
    const { state, snackbarDispatch } = useContext(GlobalContext);
    const userId = window.location.pathname.substring(6);

    const { loading, data } = useQuery<QueryResult>(GET_POSTS_FROM_USER, {
        variables: { userId },
        onError: (error): unknown => handleError(error, undefined)
    });

    return (
        <Container className="user-page__container">
            <Grid columns={1} divided className="user-page__grid">
                <Grid.Row className="user-page__profile-container">
                    <Profile userId={userId} />
                </Grid.Row>
                {state && state.id.toString() === userId &&
                    <Grid.Row>
                        <PostForm userId={userId} snackbarDispatch={snackbarDispatch} />
                    </Grid.Row>
                }
                <Grid.Row>
                    {loading ?
                        <Dimmer active={loading} className="home-page__dimmer">
                            <Loader>Loading posts...</Loader>
                        </Dimmer>
                        :
                        <CardGroup itemsPerRow={1}>
                            {data && data.posts_from_user.map(post => {
                                return <PostCard post={post} key={post.postId} />
                            })}
                        </CardGroup>
                    }
                </Grid.Row>
            </Grid>
        </Container>
    )
}