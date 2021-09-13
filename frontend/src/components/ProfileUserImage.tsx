import React, { useContext } from 'react';
// Context
import { GlobalContext } from '../context/GlobalContext';
// Components
import ProfilePlaceholder from '../assets/ProfilePlaceholder.png';
import { Image } from 'semantic-ui-react';

type Props = {
    userImage: string
    username: string
    loading: boolean
    setUserImageModalOpen: Function
};

export default function ProfileUserImage(props: Props) {
    const { state } = useContext(GlobalContext);
    const { userImage, username, loading, setUserImageModalOpen } = props;

    return (
        <div className="profile__user-image-container">
            <Image
                fluid
                className={loading ? "loading profile__user-image" : "profile__user-image"}
                src={userImage ? `data:image/png;base64,${userImage}` : ProfilePlaceholder}
            />
            {state?.username === username ?
                <div className="profile__actual-change-user-image" onClick={() => setUserImageModalOpen(true)}>
                    Change Image
                </div>
                :
                <div className="profile__change-user-image">
                    Change Image
                </div>
            }
        </div>
    )
};