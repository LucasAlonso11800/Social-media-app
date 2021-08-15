import Profile from "./components/Profile";

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

export interface ISinglePostQuery{
    single_post: IPost
};

export interface IPostsFromUserQuery{
    posts_from_user: IPost[]
};

export interface IPost {
    body: string
    comments: IComment[]
    createdAt: string
    id: string
    likes: ILike[]
    username: string
};

export interface IComment {
    body: string
    createdAt: string
    id: string
    username: string
};

export interface ILike {
    createdAt: string
    id: string
    username: string
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
};

export interface IAddComment {
    body: string
};


// Profiles

export interface IProfile {
    profileName: string
    profileImage: string
    bio: string
    user: {
        image: string
    }
};

export interface IProfileQuery {
    profile: IProfile
};

export interface IEditProfile {
    profileName: string
    bio: string
};