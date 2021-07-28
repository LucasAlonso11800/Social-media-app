import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_POSTS } from '../graphql/Queries';
// Semantic
import { Grid, Container, CardGroup } from 'semantic-ui-react';
// Interfaces
import { IPostQuery } from '../Interfaces';
// Components
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';

function HomePage() {
    const { state } = useContext(GlobalContext);
    const { loading, data } = useQuery<IPostQuery>(GET_POSTS);
    return (
        <Container>
            <Grid columns={2} divided>
                <Grid.Row>
                    <h1>Recent Posts</h1>
                </Grid.Row>
                <Grid.Row>
                    {loading ? <h1>Loading posts...</h1> : null}
                </Grid.Row>
                <Grid.Row>
                    {state ? <PostForm /> : null}
                </Grid.Row>
                <Grid.Row>
                    <CardGroup itemsPerRow={1} style={{ width: '100%' }}>
                        {data && data.all_posts.map(post => {
                            return <PostCard post={post} key={post.id} />
                        })}
                    </CardGroup>
                </Grid.Row>
            </Grid>
        </Container>
    )
}

export default HomePage