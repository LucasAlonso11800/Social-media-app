import React, { useEffect, useContext } from 'react';
// Context
import { GlobalContext } from '../context/GlobalContext';
// Components
import { Message } from 'semantic-ui-react';
// Interfaces
import { ESnackbarActionType } from '../Interfaces';

export default function Snackbar() {
    const { snackbarState, snackbarDispatch } = useContext(GlobalContext);

    const type = ESnackbarActionType.CLOSE;

    useEffect(() => {
        if (snackbarState.open === true) setTimeout(() => snackbarDispatch({ type, payload: null }), 5000)
    }, [snackbarState]);

    return (
        <Message className={snackbarState.open ? "snackbar open" : "snackbar closed"} color="red">
            <Message.Content>{snackbarState.message}</Message.Content>
        </Message>
    )
};