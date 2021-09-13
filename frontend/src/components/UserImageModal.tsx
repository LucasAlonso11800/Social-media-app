import React, { useState, useRef } from 'react';
// GraphQL
import { useMutation, useQuery } from '@apollo/client';
import { EDIT_USER_IMAGE } from '../graphql/Mutations';
// Components
import { Modal, Image, Button } from 'semantic-ui-react';
import ProfilePlaceholder from '../assets/ProfilePlaceholder.png';

type Props = {
    open: boolean
    setOpen: Function
    userImage: string
    setUserImage: Function
    userId: string
};

export default function UserImageModal(props: Props) {
    const { open, setOpen, userImage, setUserImage, userId } = props;
    const [image, setImage] = useState({
        src: userImage,
        alt: 'User image'
    });
    const [newImage, setNewImage] = useState('');
    const [fileSizeError, setFileSizeError] = useState(false);

    const [editImage, { error, loading }] = useMutation<{ edit_user_image: string }>(EDIT_USER_IMAGE, {
        onCompleted: (data) => {
            setUserImage(data.edit_user_image);
            setOpen(false);
        },
        variables: {
            image: image.src === userImage ? image.src : newImage,
            userId
        },
        onError: (): any => console.log(JSON.stringify(error, null, 2)),
    });

    const handleReaderLoaded = (readerEvt: any) => {
        const binaryString = readerEvt.target.result
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
            reader.onload = handleReaderLoaded;
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
                    src={image.src && image.src !== '' ? `data:image/png;base64,${image.src}` : ProfilePlaceholder}
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