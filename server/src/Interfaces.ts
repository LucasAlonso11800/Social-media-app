import express from 'express';

export interface IContext {
    headers: typeof express.request.headers
};

// Users
export interface IUser {
    _id: string
    email: string
    username: string
};

export interface IAddUser {
    username: string
    password: string
    confirmPassword: string
    email: string
};

export interface ILoginUser {
    username: string
    password: string
};

// Posts
export interface IGetSinglePost {
    id: string
};

export interface IGetPostsFromUser {
    username: string
};

export interface ICreatePost {
    body: string
};

export interface IDeletePost {
    postId: string
};

// Comments
export interface IComment {
    _id: string
    body: string
    username: string
    createdAt: string
    likes: ILike[]
};

export interface IAddComment {
    postId: string
    body: string
};

export interface IDeleteComment {
    postId: string
    commentId: string
};

// Likes
export interface ILike {
    id: string
    username: string
    createdAt: string
};

export interface ILikePost {
    postId: string
};

export interface ILikeComment {
    postId: string
    commentId: string
};

// Profile

export interface IAddProfile {
    profileName: string | null
    bio: string | null
    profileImage: string | null
};

export interface IEditProfile {
    userId: string
    profileName: string
    bio: string
    profileImage: string
};

export interface IGetProfile{
    username: string
};