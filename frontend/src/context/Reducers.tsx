import { Actions, EActionType, ESnackbarActionType, GlobalState, SnackbarActions, SnackbarState } from "../Interfaces"

export function userReducer(state: GlobalState, action: Actions): GlobalState {
    switch (action.type) {
        case EActionType.LOGIN: {
            localStorage.setItem("token", action.payload.token)
            return action.payload
        }
        case EActionType.LOGOUT: {
            localStorage.removeItem("token")
            return null
        }
        default: return state
    }
};

export function snackbarReducer(state: SnackbarState, action: SnackbarActions): SnackbarState {
    switch (action.type) {
        case ESnackbarActionType.OPEN: return { open: true, message: action.payload }
        case ESnackbarActionType.CLOSE: return { open: false, message: null }
        default: return state
    }
};