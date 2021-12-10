import React, { useContext } from 'react';
// Context
import { GlobalContext } from '../context/GlobalContext';
// Components
import ProfilePlaceholder from '../assets/ProfilePlaceholder.png';
import { Image } from 'semantic-ui-react';
// Helpers
import { getBase64ImageSrc } from '../helpers/getBase64ImageSrc';

type Props = {
    userImage: string
    username: string
    loading: boolean
    setUserImageModalOpen: React.Dispatch<React.SetStateAction<boolean>>
};

export default function ProfileUserImage(props: Props) {
    const { state } = useContext(GlobalContext);
    const { userImage, username, loading, setUserImageModalOpen } = props;

    const imageSrc = userImage ? getBase64ImageSrc(userImage) : ProfilePlaceholder;

    return (
        <div className="profile__user-image-container">
            <Image
                fluid
                className={loading ? "loading profile__user-image" : "profile__user-image"}
                src={imageSrc}
                data-testid="userImage"
            />
            {state?.username === username ?
                <div
                    className="profile__actual-change-user-image"
                    onClick={() => setUserImageModalOpen(true)}
                    data-testid="actualChangeUserImage"
                >
                    Change Image
                </div>
                :
                <div
                    className="profile__change-user-image"
                    data-testid="changeUserImage"
                >
                    Change Image
                </div>
            }
        </div>
    )
};