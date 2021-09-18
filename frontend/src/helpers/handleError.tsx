import { ApolloError } from "@apollo/client";
// Consts
import { defaultErrorMessage } from "../consts/DefaultErrorMessage";
// Interfaces
import { ESnackbarActionType, SnackbarActions } from "../Interfaces";

export function handleError(error: ApolloError, snackbarDispatch: React.Dispatch<SnackbarActions> | undefined): void | null {
    const type = ESnackbarActionType.OPEN
    
    console.log(JSON.stringify(error, null, 2))

    switch (error.message) {
        case "Failed to fetch": return snackbarDispatch ? snackbarDispatch({ type, payload: defaultErrorMessage }) : null
        case "Error: User not found": case "Error: Post not found": return window.location.assign('/404')
        default: return snackbarDispatch ? snackbarDispatch({ type, payload: error.message }) : null
    }
};