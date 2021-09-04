import React, { useState, useContext } from 'react';
import moment from 'moment';
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
import UserImageModal from './UserImageModal';
import BlockUserButton from './BlockUserButton';
import DeleteUserButton from './DeleteUserButton';

type Props = {
    username: string;
};

export default function Profile(props: Props) {
    const { state } = useContext(GlobalContext);
    const { username } = props;
    const [modalOpen, setModalOpen] = useState(false);
    const [userImageModalOpen, setUserImageModalOpen] = useState(false);

    const { error, loading, data } = useQuery<IProfileQuery>(GET_PROFILE, { variables: { username } });

    if (data) {
        const { profile: { profileName, profileImage, bio, user } } = data as IProfileQuery;
        const followsUser = state?.following.find(f => f.username === user.username);
        const userIsBlocked = state?.blockedUsers.find(u => u.username === username);

        const hasBeenBlocked = user.blockedUsers.find(u => u.username === state?.username);
        if (hasBeenBlocked) window.location.replace('/');
        return (
            <Card fluid>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width="16">
                            <Image fluid className="profile__profile-image" src={profileImage ? `data:image/png;base64,${profileImage}` : ProfilePlaceholder} />
                        </Grid.Column>
                        <div className="profile__user-image-container">
                            <Image fluid className="profile__user-image" src={user.image ? `data:image/png;base64,${user.image}` : ProfilePlaceholder} />
                            <div className={state?.username === user.username ? "profile__actual-change-user-image" : "profile__change-user-image"}
                                onClick={state?.username === user.username ? () => setUserImageModalOpen(true) : () => { }}>
                                Change Image
                            </div>
                        </div>
                    </Grid.Row>
                </Grid>
                <Card.Content>
                    <div className="profile__name-follow-container">
                        <h2>{profileName}</h2>
                        <div>
                            {!state || state.username !== username ? <FollowButton followsUser={followsUser} followedUser={user} /> : null}
                            {state && state.username === username &&
                                <>
                                    <Popup
                                        content="Edit profile"
                                        inverted
                                        trigger={
                                            <Button as="div" color="grey" onClick={() => setModalOpen(true)}>
                                                <Icon name="edit" />
                                            </Button>
                                        }
                                    />
                                    <DeleteUserButton username={username}/>
                                </>
                            }
                            {state && state.username !== username ? <BlockUserButton profile={data.profile} userIsBlocked={userIsBlocked ? true : false} /> : null}
                        </div>
                    </div>
                    <Card.Meta><Icon name="user outline" className="profile__icon" /> {username}</Card.Meta>
                    <Card.Meta>
                        <Popup
                            inverted
                            content="Lives in"
                            trigger={<Icon name="map marker alternate" className="profile__icon" />}
                        />{user.city}, {user.country}</Card.Meta>
                    <Card.Meta>
                        <Popup
                            inverted
                            content="Age"
                            trigger={<Icon name="calendar times" className="profile__icon" />}
                        />{moment(user.birthDate).fromNow(true)}</Card.Meta>
                    <div className="profile__profile-info">
                        <Card.Description><b>About {user.username}:</b> {bio}</Card.Description>
                        <div className="profile__numbers-container">
                            <p className="profile__number">Followers: <b>{user.followers.length} </b></p>
                            <p className="profile__number">Following: <b>{user.following.length} </b></p>
                        </div>
                    </div>
                </Card.Content>
                <ProfileModal open={modalOpen} setOpen={setModalOpen} profile={data.profile} username={username} />
                <UserImageModal open={userImageModalOpen} setOpen={setUserImageModalOpen} profile={data.profile} />
            </Card>
        )
    }
    return null
};