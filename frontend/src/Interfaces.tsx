// Context
export interface IUserData{
    email: string
    id: string
    token: string
    username: string
    image: string
    country: string
    city: string
    birthDate: string
    followers: IFollower[]
    following: IFollower[]
    blockedUsers: IUserData[]
};

export interface IDecodedToken extends IUserData {
    exp: number
    iat: number
};

export enum EActionType {
    LOGIN,
    LOGOUT
};

export interface ILoginAction {
    type: EActionType.LOGIN
    payload: IUserData
};

export interface ILogoutAction {
    type: EActionType.LOGOUT
    payload: null
};

export type Actions = ILoginAction | ILogoutAction;

export type GlobalState = IUserData | null;

// Users

export interface IUsersBySearchQuery{
    users_by_search: IUserData[]
};

// Posts

export interface IPostsBySearchQuery{
    posts_by_search: IPost[]
};

export interface ISinglePostQuery{
    single_post: IPost
};

export interface IPost {
    id: string
    postId: string
    body: string
    createdAt: string
    userId: string
    username: string
    profileName: string
    comments: IComment[],
    likes: ILike[]
};

// Comments

export interface IComment {
    body: string
    createdAt: string
    id: string
    username: string
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

export interface IFollower {
    username: string
};

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

// Forms

export interface IAddUser {
    username: string
    email: string
    password: string
    confirmPassword: string
    city: string
    birthDate: string
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

export interface IEditProfile {
    profileName: string
    bio: string
};