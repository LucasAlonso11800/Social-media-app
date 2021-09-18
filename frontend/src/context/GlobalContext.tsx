import React, { createContext, useReducer } from "react";
import { Actions, GlobalState, SnackbarActions, SnackbarState } from '../Interfaces';
import { userReducer, snackbarReducer } from './Reducers';
import { checkAuth } from "../helpers/checkAuth";

const initialState: GlobalState = checkAuth();
const initialSnackbarState: SnackbarState = { open: false, message: null };

export const GlobalContext = createContext<{
    state: GlobalState
    dispatch: React.Dispatch<Actions>
    snackbarState: SnackbarState
    snackbarDispatch: React.Dispatch<SnackbarActions>
}>({
    state: initialState,
    dispatch: () => { },
    snackbarState: initialSnackbarState,
    snackbarDispatch: () => { }
});

export function GlobalProvider(props: any): JSX.Element {
    const [state, dispatch] = useReducer(userReducer, initialState);
    const [snackbarState, snackbarDispatch] = useReducer(snackbarReducer, initialSnackbarState);

    return (
        <GlobalContext.Provider value={{ state, dispatch, snackbarState, snackbarDispatch }}>
            {props.children}
        </GlobalContext.Provider>
    )
}