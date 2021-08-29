import React from 'react';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_USER_IMAGE } from '../graphql/Queries';
// Components
import { Card, Container, Image } from 'semantic-ui-react';
import ProfilePlaceholder from '../assets/ProfilePlaceholder.png';
// Interfaces
import { IUserData } from '../Interfaces';

type Props = {
    user: IUserData
};

export default function UserCard(props: Props) {
    const { user } = props;

    const { error, loading, data } = useQuery(GET_USER_IMAGE, {
        variables: { username: user.username }
    });

    return (
        <Card fluid centered>
            <Card.Content>
                <div className="user-card__user-image-container">
                    <Image
                        className={loading ? "loading" : "user-card__user-image"}
                        src={data?.user_image.image ? `data:image/png;base64,${data?.user_image.image}` : ProfilePlaceholder}
                        onClick={() => window.location.href = `/user/${user.username}`}
                    />
                </div>
                <Card.Header
                    className="user-card__username"
                    onClick={() => window.location.href = `/user/${user.username}`}
                >
                    {user.username}
                </Card.Header>
                <Card.Content extra className="user-card__user-data">
                    <p><b>Followers: </b>{user.followers.length}</p>
                    <p><b>Following: </b>{user.followers.length}</p>
                </Card.Content>
            </Card.Content>
        </Card>
    )
};