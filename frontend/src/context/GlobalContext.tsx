import React, { createContext, useReducer } from "react";
import { Actions, ActionType, GlobalState } from '../Interfaces';

const initialState: GlobalState = null;

export const GlobalContext = createContext<{
    state: GlobalState;
    dispatch: React.Dispatch<Actions>
}>({
    state: initialState,
    dispatch: () => { }
});

function reducer(state: GlobalState, action: Actions): GlobalState {
    switch (action.type) {
        case ActionType.LOGIN: return action.payload
        case ActionType.LOGOUT: return null
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