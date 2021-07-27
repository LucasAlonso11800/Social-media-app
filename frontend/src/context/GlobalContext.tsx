import React, { createContext, useReducer } from "react";
import { IAction, IGlobalState } from '../Interfaces';

const initialState: IGlobalState = {
    userData: null,
};

export const GlobalContext = createContext<IGlobalState | any>(initialState);

function reducer(state: IGlobalState, action: IAction): IGlobalState {
    switch (action.type) {
        case 'LOGIN': return {
            userData: action.payload,
        }
        case 'LOGOUT': return {
            userData: null
        }
        default: return {
            userData: action.payload
        }
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