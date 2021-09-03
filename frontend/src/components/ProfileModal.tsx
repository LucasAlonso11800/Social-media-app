import React, { useState, useEffect, useRef, useContext } from 'react';
// Components
import { Modal, Container, Form, Button, Image } from 'semantic-ui-react';
import ProfilePlaceholder from '../assets/ProfilePlaceholder.png';
// GraphQL
import { useMutation } from '@apollo/client';
import { EDIT_PROFILE } from '../graphql/Mutations';
// Form
import * as yup from 'yup';
import { useFormik } from 'formik';
// Interfaces
import { IEditProfile, IProfile, IProfileQuery } from '../Interfaces';
// Context
import { GlobalContext } from '../context/GlobalContext';
import { GET_PROFILE } from '../graphql/Queries';

type Props = {
    open: boolean,
    setOpen: Function,
    profile: IProfile,
    username: string
};

const validationSchema = yup.object({
    profileName: yup.string().max(40, "Profile name can't be longer than 40 characters").required("Profile name can't be empty"),
    bio: yup.string().max(140, "Description can't be longer than 140 characters").required("Profile description can't be empty"),
});

function ProfileModal(props: Props) {
    const { open, setOpen, profile, username } = props;
    const { state } = useContext(GlobalContext)
    const [image, setImage] = useState({
        alt: 'Profile image',
        src: profile.profileImage
    });
    const [fileSizeError, setFileSizeError] = useState(false);
    const [newImage, setNewImage] = useState('');
    const [queryVariables, setQueryVariables] = useState<IEditProfile>();

    const [editProfile, { error, loading }] = useMutation(EDIT_PROFILE, {
        update: (proxy, result) => {
            const data: IProfileQuery = proxy.readQuery({
                query: GET_PROFILE,
                variables: { username }
            }) as IProfileQuery;

            proxy.writeQuery({
                query: GET_PROFILE,
                variables: { username },
                data: {
                    profile: {
                        user: data.profile.user,
                        bio: result.data.edit_profile.bio,
                        id: result.data.edit_profile.id,
                        profileImage: result.data.edit_profile.profileImage,
                        profileName: result.data.edit_profile.profileName
                    }
                }
            });
            setOpen(false);
        },
        variables: {
            ...queryVariables,
            profileImage: image.src === profile.profileImage ? image.src : newImage,
            userId: state?.id
        },
        onError: (): any => console.log(JSON.stringify(error, null, 2))
    });

    const formik = useFormik({
        initialValues: {
            profileName: profile.profileName,
            bio: profile.bio,
        },
        validationSchema,
        onSubmit: (values) => {
            if(queryVariables?.bio === values.bio && queryVariables?.profileName === values.profileName && image.src !== profile.profileImage) return editProfile()
            setQueryVariables(values)
        }
    });

    useEffect(() => {
        if (queryVariables) editProfile()
    }, [queryVariables]);

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
        <Modal open={open}>
            <Container>
                <Form className={loading ? "loading profile-modal__form" : "profile-modal__form"} onSubmit={formik.handleSubmit}>
                    <h2 className="profile-modal__title">Edit your profile</h2>
                    <Form.Input
                        name="profileName"
                        label="Profile name"
                        placeholder="Profile name"
                        type="text"
                        value={formik.values.profileName}
                        error={formik.touched.profileName && Boolean(formik.errors.profileName)}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.profileName && formik.errors.profileName &&
                        <div className="ui red message">
                            <ul className="list">
                                <li>{formik.errors.profileName}</li>
                            </ul>
                        </div>
                    }
                    <Form.Input
                        name="bio"
                        label="Profile description"
                        placeholder="Profile description"
                        type="text"
                        value={formik.values.bio}
                        error={formik.touched.bio && Boolean(formik.errors.bio)}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.bio && formik.errors.bio &&
                        <div className="ui red message">
                            <ul className="list">
                                <li>{formik.errors.bio}</li>
                            </ul>
                        </div>
                    }
                    <div className="profile-modal__img-container">
                        <Image
                            src={image.src ? `data:image/png;base64,${image.src}` : ProfilePlaceholder}
                            alt={image.alt}
                            className="profile-modal__img"
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
                            className="profile-modal__img-button"
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
                            type="submit"
                            className="profile-modal__submit-button"
                            disabled={loading}
                        >Edit Profile</Button>
                    </Button.Group>
                </Form>
            </Container>
        </Modal>
    )
};

export default ProfileModal;