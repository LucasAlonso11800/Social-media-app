import { ApolloError } from "@apollo/client";

export function handleError(error: ApolloError, setSnackbarOpen: undefined | React.Dispatch<React.SetStateAction<boolean>>): void | null {
    console.log(JSON.stringify(error, null, 2))
    switch(error.message){
        case "Failed to fetch": return setSnackbarOpen ? setSnackbarOpen(true) : null
        case "Error: User not found": return window.location.assign('/404')
        case "Error: Post not found": return window.location.assign('/404')
        default: return null
    }
};