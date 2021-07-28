// Context
export interface IUserData{
    email: string;
    id: string;
    token: string;
    username: string;
};

export interface IDecodedToken extends IUserData {
    exp: number;
    iat: number;
};

export enum EActionType {
    LOGIN,
    LOGOUT
};

export interface ILoginAction {
    type: EActionType.LOGIN;
    payload: IUserData;
};

export interface ILogoutAction {
    type: EActionType.LOGOUT;
    payload: null;
};

export type Actions = ILoginAction | ILogoutAction;

export type GlobalState = IUserData | null;

// Posts

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

// Forms

export interface IAddUser {
    username: string
    email: string
    password: string
    confirmPassword: string
};

export interface ILoginUser {
    username: string
    password: string
};

export interface ICreatePost {
    body: string
}