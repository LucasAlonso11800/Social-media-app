import React from 'react'
import { Button, Icon, Popup } from 'semantic-ui-react'

type Props = {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function EditProfileButton(props: Props) {
    const { setModalOpen } = props;
    return (
        <Popup
            content="Edit profile"
            inverted
            trigger={
                <Button
                    as="div"
                    color="grey"
                    onClick={() => setModalOpen(true)}
                    data-testid="editProfileButton"
                    >
                    <Icon name="edit" />
                </Button>
            }
        />
    )
}
