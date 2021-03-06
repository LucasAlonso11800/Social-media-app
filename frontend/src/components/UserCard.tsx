import React, { useContext } from 'react';
import moment from 'moment';
// Context
import { GlobalContext } from '../context/GlobalContext';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_FOLLOW_STATUS, GET_USER_IMAGE } from '../graphql/Queries';
// Components
import { Card, Icon, Image, Popup } from 'semantic-ui-react';
import ProfilePlaceholder from '../assets/ProfilePlaceholder.png';
// Interfaces
import { IFollowStatus, IUserData } from '../Interfaces';
// Helpers
import { handleError } from '../helpers/handleError';
import { getBase64ImageSrc } from '../helpers/getBase64ImageSrc';

type Props = {
    user: IUserData
};

type QueryResult = {
    follow_status: IFollowStatus
};

export default function UserCard(props: Props) {
    const { state } = useContext(GlobalContext);
    const { user } = props;

    const { data } = useQuery<{ user_image: string }>(GET_USER_IMAGE, {
        variables: { userId: user.id },
        onError: (error): unknown => handleError(error, undefined)
    });

    const { data: followersData } = useQuery<QueryResult>(GET_FOLLOW_STATUS, {
        variables: {
            followerId: state?.id,
            followeeId: user.id
        }
    });

    const imageSrc = data?.user_image ? getBase64ImageSrc(data?.user_image) : ProfilePlaceholder;

    return (
        <Card fluid centered raised>
            <Card.Content data-testid="userCard">
                <div className="user-card__user-image-container">
                    <Image
                        className="user-card__user-image"
                        src={imageSrc}
                        onClick={() => window.location.assign(`/user/${user.id}`)}
                    />
                </div>
                <Card.Header
                    className="user-card__username"
                    onClick={() => window.location.assign(`/user/${user.id}`)}
                >
                    {user.profileName}
                </Card.Header>
                <Card.Content extra>
                    <Card.Description className="user-card__user-data">
                        <Popup
                            inverted
                            content="Username"
                            trigger={<Icon name="user" className="user-card__user-data-icon" />}
                        />
                        <p>{user.username}</p>
                    </Card.Description>
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
                        <p>{moment(user.birthDate).fromNow(true)}</p>
                    </Card.Description>
                    <Card.Description className="user-card__user-data">
                        <Icon name="users" className="user-card__user-data-icon" />
                        <p><b>Followers: </b>{followersData?.follow_status.followerCount}</p>
                    </Card.Description>
                    <Card.Description className="user-card__user-data">
                        <Icon name="users" className="user-card__user-data-icon" />
                        <p><b>Following: </b>{followersData?.follow_status.followeeCount}</p>
                    </Card.Description>
                </Card.Content>
            </Card.Content>
        </Card >
    )
};