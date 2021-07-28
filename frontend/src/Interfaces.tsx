export interface IUserData{
    createdAt: string,
    email: string,
    id: string,
    token: string,
    username: string,
    __typename: string
};

export enum ActionType {
    LOGIN,
    LOGOUT
};

export interface ILoginAction {
    type: ActionType.LOGIN;
    payload: IUserData
};

export interface ILogoutAction {
    type: ActionType.LOGOUT;
    payload: null
};

export type Actions = ILoginAction | ILogoutAction;

export type GlobalState = IUserData | null

export interface IPostQuery{
    all_posts: IPost[]
};

export interface IPost {
    body: string
    comments: IComment[]
    createdAt: string
    id: string
    likes: ILike[]
    username: string
    __typename: string
};

export interface IComment {
    body: string
    createdAt: string
    id: string
    username: string
    __typename: string
};

export interface ILike {
    createdAt: string
    id: string
    username: string
    __typename: string
};

export interface IAddUser {
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
};

export interface ILoginUser {
    username: string,
    password: string,
};