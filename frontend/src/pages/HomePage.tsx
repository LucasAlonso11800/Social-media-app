import React from 'react';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_POSTS } from '../graphql/Queries';
// Semantic
import { Grid, Container } from 'semantic-ui-react';
// Interfaces
import { IPostQuery } from '../Interfaces';
// Components
import PostCard from '../components/PostCard';

function HomePage() {
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
                    {data && data.all_posts.map(post => {
                        return <PostCard
                            key={post.id}
                            post={post}
                        />
                    })}
                </Grid.Row>
            </Grid>
        </Container>
    )
}

export default HomePage