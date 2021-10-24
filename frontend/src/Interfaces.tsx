// Context
export interface IUserContext {
    id: number
    token: string
    username: string
}
export interface IUserData extends IUserContext {
    profileName: string
    country: string
    city: string
    birthDate: string
};

export interface IDecodedToken extends IUserContext {
    exp: number
    iat: number
};

export enum EActionType {
    LOGIN,
    LOGOUT
};

export interface ILoginAction {
    type: EActionType.LOGIN
    payload: IUserContext
};

export interface ILogoutAction {
    type: EActionType.LOGOUT
    payload: null
};

export type Actions = ILoginAction | ILogoutAction;

export type GlobalState = IUserContext | null;

export type SnackbarState = {
    open: boolean
    message: string | null
};

export enum ESnackbarActionType {
    OPEN,
    CLOSE
};

export interface IOpenSnackbarAction {
    type: ESnackbarActionType.OPEN
    payload: string
};

export interface ICloseSnackbarAction {
    type: ESnackbarActionType.CLOSE
    payload: null
};

export type SnackbarActions = IOpenSnackbarAction | ICloseSnackbarAction

// Posts

export interface IPost {
    postId: string
    body: string
    createdAt: string
    userId: string
    username: string
    profileName: string
};

// Comments

export interface IComment {
    id: string
    body: string
    createdAt: string
    username: string
    profileName: string
};

// Likes

export interface ILike {
    createdAt: string
    id: string
    username: string
};

export interface ILikeStatus {
    count: number,
    liked: boolean
};

// Profiles

export interface IProfile {
    profileName: string
    profileImage: string
    bio: string
    city: string
    country: string
    birthDate: string
    username: string
    id: string
};

// Followers

export interface IFollowStatus {
    followeeCount: number
    followerCount: number
    follows: boolean
};

// Blocks

export interface IBlockStatus {
    isBlocking: boolean
    isBlocked: boolean
};