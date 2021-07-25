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