import React, { useContext } from 'react';
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
        <Container>
            <Grid>
                <Grid.Row className="user-page__profile-container">
                    {loading ?
                        <Dimmer active={loading} inverted className="home-page__loader">
                            <Loader>Loading...</Loader>
                        </Dimmer>
                        :
                        <Profile userId={userId} />
                    }
                </Grid.Row>
                {state && state.id.toString() === userId &&
                    <Grid.Row>
                        <PostForm userId={userId} snackbarDispatch={snackbarDispatch}/>
                    </Grid.Row>
                }
                <Grid.Row>
                    <CardGroup itemsPerRow={1} style={{ width: '100%' }}>
                        {data && data.posts_from_user.map(post => {
                            return <PostCard post={post} key={post.postId} />
                        })}
                    </CardGroup>
                </Grid.Row>
            </Grid>
        </Container>
    )
}