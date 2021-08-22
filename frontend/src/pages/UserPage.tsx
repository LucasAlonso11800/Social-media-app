import React from 'react';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_POSTS_FROM_USER } from '../graphql/Queries';
// Semantic
import { Grid, Container, Card, CardGroup } from 'semantic-ui-react';
// Interfaces
import { IPostsFromUserQuery } from '../Interfaces';
// Components
import PostCard from '../components/PostCard';
import Profile from '../components/Profile';

function UserPage() {
    const username = window.location.pathname.substring(6).replaceAll('%20', ' ');

    const { error, loading, data } = useQuery<IPostsFromUserQuery>(GET_POSTS_FROM_USER, { variables: { username: username } });

    return (
        <Container>
            <Grid>
                <Grid.Row>
                    {loading ? <h1>Loading profile...</h1> : null}
                </Grid.Row>
                <Grid.Row>
                    <Profile username={username}/>
                </Grid.Row>
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