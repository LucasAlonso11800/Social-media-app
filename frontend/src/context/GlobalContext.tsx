import React, { createContext, useReducer } from "react";
import { Actions, EActionType, GlobalState, IDecodedToken } from '../Interfaces';
import jwtDecode from 'jwt-decode';

let initialState: GlobalState = null;

if(localStorage.getItem("token")){
    const decodedToken: IDecodedToken = jwtDecode(localStorage.getItem("token") as string);
    
    if(decodedToken.exp * 1000 < Date.now()){
        localStorage.removeItem("token");
    } else {
        initialState = {
            email: decodedToken.email,
            id: decodedToken.id,
            username: decodedToken.username,
            token: localStorage.getItem("token") as string,
            image: '',
            followers: [],
            following: []
        }
    }
};

export const GlobalContext = createContext<{
    state: GlobalState;
    dispatch: React.Dispatch<Actions>
}>({
    state: initialState,
    dispatch: () => { }
});

function reducer(state: GlobalState, action: Actions): GlobalState {
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

export function GlobalProvider(props: any): JSX.Element {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {props.children}
        </GlobalContext.Provider>
    )
}