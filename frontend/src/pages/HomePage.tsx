import React, { useState, useEffect } from 'react';
// GraphQL
import { useLazyQuery } from '@apollo/client';
import { GET_POSTS_BY_SEARCH, GET_USERS_BY_SEARCH } from '../graphql/Queries';
// Interfaces
import { IPost, IPostsBySearchQuery, IUserData, IUsersBySearchQuery } from '../Interfaces';
// Components
import { Grid, Container, CardGroup, Dimmer, Loader } from 'semantic-ui-react';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';

export default function HomePage() {
    const [posts, setPosts] = useState<IPost[]>([]);
    const [users, setUsers] = useState<IUserData[]>([]);

    const [lookingForPosts, setLookingForPosts] = useState(true);
    const [query, setQuery] = useState('');

    const [searchData, { error, loading }] = useLazyQuery(lookingForPosts ? GET_POSTS_BY_SEARCH : GET_USERS_BY_SEARCH, {
        onCompleted: (data: IUsersBySearchQuery | IPostsBySearchQuery) => {
            if ("posts_by_search" in data) {
                setUsers([]);
                setPosts(data.posts_by_search);
            };
            if ("users_by_search" in data) {
                setPosts([]);
                setUsers(data.users_by_search);
            };
        },
        onError: (): any => console.log(JSON.stringify(error, null, 2))
    });

    useEffect(() => {
        searchData({ variables: { query: '' } })
    }, []);

    return (
        <Container>
            <Grid columns={3} divided>
                <Grid.Row>
                    <SearchBar
                        loading={loading}
                        searchData={searchData}
                        query={query}
                        setQuery={setQuery}
                        setLookingForPosts={setLookingForPosts}
                    />
                </Grid.Row>
                <Grid.Row>
                    <Dimmer active={loading} inverted className="home-page__loader">
                        <Loader>Loading...</Loader>
                    </Dimmer>
                </Grid.Row>
                <Grid.Row>
                    {!loading && users.length === 0 &&
                        <CardGroup itemsPerRow={1} style={{ width: '100%' }}>
                            {posts.map(post => {
                                return <PostCard post={post} key={post.id} />
                            })}
                        </CardGroup>
                    }
                    {!loading && posts.length === 0 &&
                        <CardGroup itemsPerRow={4} style={{ width: '100%' }}>
                            {users.map(user => {
                                return <UserCard user={user} key={user.id} />
                            })}
                        </CardGroup>
                    }
                </Grid.Row>
            </Grid>
        </Container>
    )
};