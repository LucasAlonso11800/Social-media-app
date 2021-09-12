import React, { useState, useRef } from 'react';
// GraphQL
import { useMutation } from '@apollo/client';
import { EDIT_USER_IMAGE } from '../graphql/Mutations';
// Components
import { Modal, Image, Button } from 'semantic-ui-react';
import ProfilePlaceholder from '../assets/ProfilePlaceholder.png';
// Interfaces
import { IProfile } from '../Interfaces';

type Props = {
    open: boolean
    setOpen: Function
    profile: IProfile
}

export default function UserImageModal(props: Props) {
    const { open, setOpen, profile } = props;
    const [image, setImage] = useState({
        src: profile.profileImage,
        alt: 'User image'
    });
    const [newImage, setNewImage] = useState('');
    const [fileSizeError, setFileSizeError] = useState(false);

    const [editImage, { error, loading }] = useMutation(EDIT_USER_IMAGE, {
        update() {
            window.location.reload()
        },
        variables: {
            image: image.src === profile.profileImage ? image.src : newImage
        },
        onError: (): any => console.log(JSON.stringify(error, null, 2)),
    });

    const _handleReaderLoaded = (readerEvt: any) => {
        let binaryString = readerEvt.target.result
        setImage({ ...image, src: btoa(binaryString) })
        setNewImage(btoa(binaryString))
    };

    const handleImg = (e: any) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 1048577) return setFileSizeError(true);
            setFileSizeError(false);
            setImage({ ...image, alt: file.name })
            const reader = new FileReader();
            reader.onload = _handleReaderLoaded;
            reader.readAsBinaryString(file);
        }
    };

    const inputFile: any = useRef(null);
    const onButtonClick = () => inputFile.current.click();

    return (
        <Modal open={open} className="user-modal">
            <h2 className="user-modal__title">Edit your image</h2>
            <p className="user-modal__subtitle">It's the image that will be displayed besides your posts and comments</p>
            <div className="user-modal__img-container">
                <Image
                    src={image.src ? `data:image/png;base64,${image.src}` : ProfilePlaceholder}
                    alt={image.alt}
                    className="user-modal__img"
                />
                <input
                    style={{ display: "none" }}
                    accept="image/png, image/jpeg, image/jpg"
                    ref={inputFile}
                    onChange={handleImg}
                    type="file"
                />
                <Button
                    type="button"
                    onClick={() => onButtonClick()}
                    className="user-modal__img-button"
                    disabled={loading}
                >Change image</Button>
            </div>
            {fileSizeError ?
                <div className="ui red message">
                    <ul className="list">
                        <li>File size must be under 1MB</li>
                    </ul>
                </div>
                : null}
            <Button.Group fluid>
                <Button
                    color="grey"
                    onClick={() => setOpen(false)}
                    className="profile-modal__close-button"
                    disabled={loading}
                >Close</Button>
                <Button
                    color="twitter"
                    type="button"
                    className="profile-modal__submit-button"
                    disabled={loading}
                    onClick={() => editImage()}
                >Edit Image</Button>
            </Button.Group>
        </Modal>
    )
};