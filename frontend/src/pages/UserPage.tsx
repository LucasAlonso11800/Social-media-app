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

type QueryResult = {
    posts_from_user: IPost[]
};

export default function UserPage() {
    const { state } = useContext(GlobalContext);
    const userId = window.location.pathname.substring(6);

    const { error, loading, data } = useQuery<QueryResult>(GET_POSTS_FROM_USER, {
        variables: { userId },
        onError: (): any => console.log(JSON.stringify(error, null, 2))
    });

    if(error && error.message === "Error: User not found") window.location.assign('/404');

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
                {state && state.id === userId &&
                    <Grid.Row>
                        <PostForm />
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