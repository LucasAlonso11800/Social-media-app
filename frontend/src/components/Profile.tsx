import React, { useState, useContext } from 'react';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_PROFILE } from '../graphql/Queries';
// Context 
import { GlobalContext } from '../context/GlobalContext';
// Components
import { Grid, Card, Image, Button, Icon, Popup } from 'semantic-ui-react';
import ProfileModal from './ProfileModal';
import ProfilePlaceholder from '../assets/ProfilePlaceholder.png';
import FollowButton from './FollowButton';
// Interfaces
import { IProfileQuery } from '../Interfaces';

type Props = {
    username: string;
};

export default function Profile(props: Props) {
    const { state } = useContext(GlobalContext);
    const { username } = props;
    const [modalOpen, setModalOpen] = useState(false);

    const { error, loading, data } = useQuery<IProfileQuery>(GET_PROFILE, { variables: { username } });

    if (data) {
        const { profile: { profileName, profileImage, bio, user } } = data as IProfileQuery;
        const followsUser = state?.following.find(f => f.username === user.username);
        
        return (
            <Card fluid>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width="8">
                            <Image fluid className="profile__image" src={user && user.image ? `data:image/png;base64,${user.image}` : ProfilePlaceholder} />
                        </Grid.Column>
                        <Grid.Column width="8">
                            <Image fluid className="profile__image" src={profileImage ? `data:image/png;base64,${profileImage}` : ProfilePlaceholder} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Card.Content>
                    <div className="profile__name-follow-container">
                        <h2>{profileName}</h2>
                        <div>
                            {!state || state.username !== username ? <FollowButton followsUser={followsUser} followedUser={user} /> : null}
                            {state && state.username === username &&
                                <Popup
                                    content="Edit profile"
                                    inverted
                                    trigger={
                                        <Button as="div" color="grey" onClick={() => setModalOpen(true)}>
                                            <Icon name="edit" />
                                        </Button>
                                    }
                                />
                            }
                        </div>
                    </div>
                    <Card.Meta>{username}</Card.Meta>
                    <Card.Description>{bio}</Card.Description>
                    <div className="profile__numbers-container">
                        <p className="profile__number"><b>{user.followers.length} </b>Followers</p>
                        <p className="profile__number"><b>{user.following.length} </b>Following</p>
                    </div>
                </Card.Content>
                <ProfileModal open={modalOpen} setOpen={setModalOpen} profile={data.profile} />
            </Card>
        )
    }
    return null
};