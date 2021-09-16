import React, { useEffect, useContext } from 'react';
// Context
import { GlobalContext } from '../context/GlobalContext';
// Components
import { Message } from 'semantic-ui-react';

export default function Snackbar() {
    const { snackbarOpen, setSnackbarOpen } = useContext(GlobalContext);

    useEffect(() => {
        if (snackbarOpen === true) setTimeout(() => setSnackbarOpen(false), 5000)
    }, [snackbarOpen]);

    return (
        <Message className={snackbarOpen ? "snackbar open" : "snackbar closed"} color="red">
            <Message.Content>An unexpected error occurred in the server</Message.Content>
        </Message>
    )
};