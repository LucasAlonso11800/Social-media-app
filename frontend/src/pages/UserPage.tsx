import React, { useContext } from 'react';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_POSTS_FROM_USER } from '../graphql/Queries';
// Context
import { GlobalContext } from '../context/GlobalContext';
// Semantic
import { Grid, Container, CardGroup, Dimmer, Loader } from 'semantic-ui-react';
// Interfaces
import { IPostsFromUserQuery } from '../Interfaces';
// Components
import PostCard from '../components/PostCard';
import Profile from '../components/Profile';
import PostForm from '../components/PostForm';

function UserPage() {
    const { state } = useContext(GlobalContext);
    const username = window.location.pathname.substring(6).replaceAll('%20', ' ');

    const { error, loading, data } = useQuery<IPostsFromUserQuery>(GET_POSTS_FROM_USER, { variables: { username: username } });

    return (
        <Container>
            <Grid>
                <Grid.Row className="user-page__profile-container">
                    {loading ?
                        <Dimmer active={loading} inverted className="home-page__loader">
                            <Loader>Loading...</Loader>
                        </Dimmer>
                        :
                        <Profile username={username} />
                    }
                </Grid.Row>
                {state && state.username === username &&
                    <Grid.Row>
                        <PostForm />
                    </Grid.Row>
                }
                <Grid.Row>
                    <CardGroup itemsPerRow={1} style={{ width: '100%' }}>
                        {data && data.posts_from_user.map(post => {
                            return <PostCard post={post} key={post.id} />
                        })}
                    </CardGroup>
                </Grid.Row>
            </Grid>
        </Container>
    )
}

export default UserPage;