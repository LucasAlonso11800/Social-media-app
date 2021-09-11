import React, { useState, useContext } from 'react';
// Context
import { GlobalContext } from '../context/GlobalContext';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_HOME_PAGE_POSTS } from '../graphql/Queries';
// Interfaces
import { IHomePagePostsQuery, IPost, IUserData } from '../Interfaces';
// Components
import { Grid, Container, CardGroup, Dimmer, Loader } from 'semantic-ui-react';
import PostCard from '../components/PostCard';

export default function HomePage() {
    const { state } = useContext(GlobalContext);

    const { error, loading, data } = useQuery<IHomePagePostsQuery>(GET_HOME_PAGE_POSTS, {
        variables: { id: state !== null ? state.id : null },
        onError: (): any => console.log(JSON.stringify(error, null, 2))
    });

    return (
        <Container>
            <Grid columns={3} divided>
                <Grid.Row>
                    <Dimmer active={loading} inverted className="home-page__loader">
                        <Loader>Loading posts...</Loader>
                    </Dimmer>
                </Grid.Row>
                <Grid.Row>
                    {!loading && data?.home_page_posts &&
                        <CardGroup itemsPerRow={1} style={{ width: '100%' }}>
                            {data.home_page_posts.map(post => {
                                return <PostCard post={post} key={post.postId} />
                            })}
                        </CardGroup>
                    }
                </Grid.Row>
            </Grid>
        </Container>
    )
};