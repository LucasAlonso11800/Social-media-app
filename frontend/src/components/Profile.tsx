import React, { useState, useContext } from 'react';
import moment from 'moment';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_BLOCK_STATUS, GET_FOLLOW_STATUS, GET_PROFILE, GET_USER_IMAGE } from '../graphql/Queries';
// Context 
import { GlobalContext } from '../context/GlobalContext';
// Components
import { Grid, Card, Image, Icon, Popup, Dimmer, Loader } from 'semantic-ui-react';
import ProfileModal from './ProfileModal';
import ProfilePlaceholder from '../assets/ProfilePlaceholder.png';
import FollowButton from './FollowButton';
import UserImageModal from './UserImageModal';
import BlockUserButton from './BlockUserButton';
import DeleteUserButton from './DeleteUserButton';
import EditProfileButton from './EditProfileButton';
import FollowerInfo from './FollowerInfo';
import ProfileUserImage from './ProfileUserImage';
// Interfaces
import { IBlockStatus, IFollowStatus, IProfile } from '../Interfaces';
// Helpers
import { handleError } from '../helpers/handleError';
import { getBase64ImageSrc } from '../helpers/getBase64ImageSrc';

type Props = {
    userId: string;
};

type QueryResult = {
    profile: IProfile
    follow_status: IFollowStatus
    block_status: IBlockStatus
};

export default function Profile(props: Props) {
    const { state, snackbarDispatch } = useContext(GlobalContext);
    const { userId } = props;
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [userImageModalOpen, setUserImageModalOpen] = useState<boolean>(false);
    const [profile, setProfile] = useState<IProfile>();
    const [userImage, setUserImage] = useState<string>('');
    const [followStatus, setFollowStatus] = useState<IFollowStatus>();
    const [isBlocking, setIsBlocking] = useState<boolean>(false);

    const { loading } = useQuery<Pick<QueryResult, 'profile'>>(GET_PROFILE, {
        onCompleted: (data) => setProfile(data.profile),
        variables: { userId },
        onError: (error): unknown => handleError(error, undefined)
    });

    const { loading: userImageLoading } = useQuery<{ user_image: string }>(GET_USER_IMAGE, {
        onCompleted: (data) => setUserImage(data.user_image),
        variables: { userId },
        onError: (error): unknown => handleError(error, undefined)
    });

    useQuery<Pick<QueryResult, 'follow_status'>>(GET_FOLLOW_STATUS, {
        onCompleted: (data) => setFollowStatus(data.follow_status),
        variables: {
            followerId: state?.id,
            followeeId: userId
        },
        onError: (error): unknown => handleError(error, undefined)
    });

    useQuery<Pick<QueryResult, 'block_status'>>(GET_BLOCK_STATUS, {
        onCompleted: (data) => {
            if (data.block_status.isBlocked) window.location.assign('/404');
            setIsBlocking(data.block_status.isBlocking);
        },
        variables: {
            blockingUserId: state?.id,
            blockedUserId: userId
        },
        onError: (error): unknown => handleError(error, undefined)
    });

    if (loading) {
        return (
            <Dimmer active={loading} className="home-page__dimmer">
                <Loader>Loading profile...</Loader>
            </Dimmer>
        )
    };

    if (profile) {
        const { profileName, profileImage, bio, username, city, country, birthDate } = profile;

        const imageSrc = profileImage ? getBase64ImageSrc(profileImage) : ProfilePlaceholder;
        const userCanEditAndDelete = state && state.username === username;
        const userCanFollow = !state || state.username !== username;
        const userCanBlock = state && state.username !== username;

        return (
            <Card fluid data-testid="profile">
                <Grid>
                    <Grid.Row>
                        <Grid.Column width="16">
                            <Image fluid className="profile__profile-image" src={imageSrc}/>
                        </Grid.Column>
                        <ProfileUserImage userImage={userImage} username={username} loading={userImageLoading} setUserImageModalOpen={setUserImageModalOpen} />
                    </Grid.Row>
                </Grid>
                <Card.Content>
                    <div className="profile__name-follow-container">
                        <h2 className="profile__title">{profileName}</h2>
                        <div className="profile__icons-container">
                            {userCanFollow && <FollowButton followeeId={userId} followStatus={followStatus} setFollowStatus={setFollowStatus} />}
                            {userCanEditAndDelete &&
                                <>
                                    <EditProfileButton setModalOpen={setModalOpen}/>
                                    <DeleteUserButton userId={state!.id} snackbarDispatch={snackbarDispatch} />
                                </>
                            }
                            {userCanBlock && <BlockUserButton blockingUserId={state!.id} blockedUserId={userId} isBlocking={isBlocking} setIsBlocking={setIsBlocking} />}
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

                <ProfileModal
                    open={modalOpen}
                    setOpen={setModalOpen}
                    profile={profile}
                    setProfile={setProfile}
                    userId={userId}
                    snackbarDispatch={snackbarDispatch}
                />

                <UserImageModal
                    open={userImageModalOpen}
                    setOpen={setUserImageModalOpen}
                    userImage={userImage}
                    setUserImage={setUserImage}
                    userId={userId}
                    snackbarDispatch={snackbarDispatch}
                />
            </Card>
        )
    }
    return null
};