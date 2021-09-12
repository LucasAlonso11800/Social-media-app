import React, { useContext } from 'react';
// Context
import { GlobalContext } from '../context/GlobalContext';
// GraphQL
import { useQuery } from '@apollo/client';
import { GET_USER_IMAGE } from '../graphql/Queries';
// Components
import ProfilePlaceholder from '../assets/ProfilePlaceholder.png';
import { Image } from 'semantic-ui-react';

type Props = {
    username: string
    userId: string
    setUserImageModalOpen: Function
};

export default function ProfileUserImage(props: Props) {
    const { state } = useContext(GlobalContext);
    const { username, userId, setUserImageModalOpen } = props;

    const { error, loading, data } = useQuery<{ user_image: string }>(GET_USER_IMAGE, {
        variables: { userId },
        onError: (): any => console.log(JSON.stringify(error, null, 2))
    });

    return (
        <div className="profile__user-image-container">
            <Image 
                fluid
                className={loading ? "loading profile__user-image" : "profile__user-image"}
                src={data?.user_image ? `data:image/png;base64,${data?.user_image}` : ProfilePlaceholder}
            />
            <div 
                className={state?.username === username ? "profile__actual-change-user-image" : "profile__change-user-image"}
                onClick={state?.username === username ? () => setUserImageModalOpen(true) : () => { }}>
                Change Image
            </div>
        </div>
    )
};