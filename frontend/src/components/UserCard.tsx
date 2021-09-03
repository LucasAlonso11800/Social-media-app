import React from 'react';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_USER_IMAGE } from '../graphql/Queries';
// Components
import { Card, Icon, Image, Popup } from 'semantic-ui-react';
import ProfilePlaceholder from '../assets/ProfilePlaceholder.png';
// Interfaces
import { IUserData } from '../Interfaces';
import moment from 'moment';

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
                <Card.Content extra>
                    <Card.Description className="user-card__user-data">
                        <Popup
                            inverted
                            content="Lives in"
                            trigger={<Icon name="map marker alternate" className="user-card__user-data-icon" />}
                        />
                        <p> {user.city}, {user.country}</p>
                    </Card.Description>
                    <Card.Description className="user-card__user-data">
                        <Popup
                            inverted
                            content="Age"
                            trigger={<Icon name="calendar times" className="user-card__user-data-icon" />}
                        />
                        {moment(user.birthDate).fromNow(true)}</Card.Description>
                    <Card.Description className="user-card__user-data"><Icon name="users" className="user-card__user-data-icon" /> <p><b>Followers: </b>{user.followers.length}</p></Card.Description>
                    <Card.Description className="user-card__user-data"><Icon name="users" className="user-card__user-data-icon" /> <p><b>Following: </b>{user.followers.length}</p></Card.Description>
                </Card.Content>
            </Card.Content>
        </Card >
    )
};