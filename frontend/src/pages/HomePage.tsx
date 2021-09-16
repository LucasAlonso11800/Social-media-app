import React, { useContext } from 'react';
// Context
import { GlobalContext } from '../context/GlobalContext';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_HOME_PAGE_POSTS } from '../graphql/Queries';
// Interfaces
import { IPost } from '../Interfaces';
// Components
import { Grid, Container, CardGroup, Dimmer, Loader } from 'semantic-ui-react';
import PostCard from '../components/PostCard';
// Helpers
import { handleError } from '../helpers/handleError';

type QueryResult = {
    home_page_posts: IPost[]
};

export default function HomePage() {
    const { state, setSnackbarOpen } = useContext(GlobalContext);

    const { loading, data } = useQuery<QueryResult>(GET_HOME_PAGE_POSTS, {
        variables: { userId: state?.id },
        onError: (error): unknown => handleError(error, setSnackbarOpen)
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