// Context
export interface IUserData{
    email: string
    id: string
    token: string
    username: string
    image: string
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

export interface IBlockUserQuery{
    block_user: IUserData
};

export interface IUsersBySearchQuery{
    users_by_search: IUserData[]
};

export interface IBlockedUsersQuery{
    blocked_users: {
        username: string
    }[]
};

export interface IUserImageQuery{
    user_image: {
        image: string
    }
};


// Posts

export interface IPostQuery{
    all_posts: IPost[]
};

export interface IPostsBySearchQuery{
    posts_by_search: IPost[]
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
    user: IUserData
};

export interface IProfileQuery {
    profile: IProfile
};

export interface IEditProfile {
    profileName: string
    bio: string
};

// Followers

export interface IFollower {
    username: string
};

export interface IFollowUserQuery {
    follow_user: {
        following: IFollower[]
    }
};