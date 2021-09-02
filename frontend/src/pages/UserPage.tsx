import React, { useContext } from 'react';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_BLOCKED_USERS, GET_POSTS_FROM_USER } from '../graphql/Queries';
// Context
import { GlobalContext } from '../context/GlobalContext';
// Interfaces
import { IBlockedUsersQuery, IPostsFromUserQuery } from '../Interfaces';
// Components
import { Grid, Container, CardGroup, Dimmer, Loader } from 'semantic-ui-react';
import PostCard from '../components/PostCard';
import Profile from '../components/Profile';
import PostForm from '../components/PostForm';

export default function UserPage() {
    const { state } = useContext(GlobalContext);
    const username = window.location.pathname.substring(6).replaceAll('%20', ' ');

    const { error, loading, data } = useQuery<IPostsFromUserQuery>(GET_POSTS_FROM_USER, {
        variables: { username },
        onError: (): any => console.log(JSON.stringify(error, null, 2))
    });

    const { error: blockedUsersError } = useQuery<IBlockedUsersQuery>(GET_BLOCKED_USERS, {
        onCompleted: (data) => {
            if(data.blocked_users.length > 0){
                const userIsBlocked = data.blocked_users.find(u => u.username === state?.username);
                if(userIsBlocked) return window.location.assign('/404')
            }
        },
        variables: { username },
        onError: (): any => console.log(JSON.stringify(blockedUsersError, null, 2))
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