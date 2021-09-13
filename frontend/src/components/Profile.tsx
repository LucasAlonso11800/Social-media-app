import React, { useState, useContext } from 'react';
import moment from 'moment';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_FOLLOW_STATUS, GET_PROFILE, GET_USER_IMAGE } from '../graphql/Queries';
// Context 
import { GlobalContext } from '../context/GlobalContext';
// Components
import { Grid, Card, Image, Button, Icon, Popup } from 'semantic-ui-react';
import ProfileModal from './ProfileModal';
import ProfilePlaceholder from '../assets/ProfilePlaceholder.png';
import FollowButton from './FollowButton';
import UserImageModal from './UserImageModal';
import BlockUserButton from './BlockUserButton';
import DeleteUserButton from './DeleteUserButton';
import FollowerInfo from './FollowerInfo';
import ProfileUserImage from './ProfileUserImage';
// Interfaces
import { IFollowStatus, IProfile } from '../Interfaces';

type Props = {
    userId: string;
};

type QueryResult = {
    profile: IProfile
    follow_status: IFollowStatus
};

export default function Profile(props: Props) {
    const { state } = useContext(GlobalContext);
    const { userId } = props;
    const [modalOpen, setModalOpen] = useState(false);
    const [userImageModalOpen, setUserImageModalOpen] = useState(false);
    const [profile, setProfile] = useState<IProfile>();
    const [userImage, setUserImage] = useState('');
    const [followStatus, setFollowStatus] = useState<IFollowStatus>();

    const { error, loading } = useQuery<Pick<QueryResult, 'profile'>>(GET_PROFILE, {
        onCompleted: (data) => setProfile(data.profile),
        variables: { userId },
        onError: (): any => console.log(JSON.stringify(error, null, 2))
    });

    const { error: userImageError, loading: userImageLoading } = useQuery<{ user_image: string }>(GET_USER_IMAGE, {
        onCompleted: (data) => setUserImage(data.user_image),
        variables: { userId },
        onError: (): any => console.log(JSON.stringify(userImageError, null, 2))
    });

    const { error: followStatusError } = useQuery<Pick<QueryResult, 'follow_status'>>(GET_FOLLOW_STATUS, {
        onCompleted: (data) => setFollowStatus(data.follow_status),
        variables: {
            followerId: state?.id,
            followeeId: userId
        },
        onError: (): any => console.log(JSON.stringify(followStatusError, null, 2))
    });

    if (profile) {
        const { profileName, profileImage, bio, username, city, country, birthDate } = profile;

        return (
            <Card fluid className={loading ? 'loading' : ''}>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width="16">
                            <Image fluid className="profile__profile-image" src={profileImage ? `data:image/png;base64,${profileImage}` : ProfilePlaceholder} />
                        </Grid.Column>
                        <ProfileUserImage userImage={userImage} username={username} loading={userImageLoading} setUserImageModalOpen={setUserImageModalOpen} />
                    </Grid.Row>
                </Grid>
                <Card.Content>
                    <div className="profile__name-follow-container">
                        <h2>{profileName}</h2>
                        <div>
                            {!state || state.username !== username ? 
                            <FollowButton followeeId={userId} followStatus={followStatus} setFollowStatus={setFollowStatus}/> : null}
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
                                    <DeleteUserButton username={username} />
                                </>
                            }
                            {/* {state && state.username !== username ? <BlockUserButton profile={data.profile} userIsBlocked={userIsBlocked ? true : false} /> : null} */}
                        </div>
                    </div>
                    <Card.Meta><Icon name="user outline" className="profile__icon" /> {username}</Card.Meta>
                    <Card.Meta>
                        <Popup
                            inverted
                            content="Lives in"
                            trigger={<Icon name="map marker alternate" className="profile__icon" />}
                        />{city}, {country}</Card.Meta>
                    <Card.Meta>
                        <Popup
                            inverted
                            content="Age"
                            trigger={<Icon name="calendar times" className="profile__icon" />}
                        />{moment(birthDate).fromNow(true)}</Card.Meta>
                    <FollowerInfo profileName={profileName} bio={bio} followStatus={followStatus} />
                </Card.Content>
                <ProfileModal open={modalOpen} setOpen={setModalOpen} profile={profile} userId={userId} setProfile={setProfile} />
                <UserImageModal open={userImageModalOpen} setOpen={setUserImageModalOpen} userImage={userImage} setUserImage={setUserImage} userId={userId} />
            </Card>
        )
    }
    return null
};