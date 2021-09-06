import express from 'express';
import { Connection } from 'mysql2';

export interface IContext {
    headers: typeof express.request.headers,
    connection: Connection
};

// MySQL
export interface IMySQLQuery {
    fieldCount: number
    affectedRows: number
    insertId: number
    info: string
    serverStatus: number
    warningStatus: number
};

export interface IMySQLError {
    sqlError: string
};

// Users
export interface IUser {
    user_id: number
    user_email: string
    user_username: string
    user_password: string
    user_country: string
    user_city: string
    user_birth_date: string
    user_followers: any
    user_following: any
    user_blocked_users: any
};

export interface IAddUser {
    username: string
    password: string
    country: string
    city: string
    birthDate: string
    confirmPassword: string
    email: string
};

export interface ILoginUser {
    username: string
    password: string
};

export interface IEditUserImage {
    image: string
};

export interface IGetUser {
    username: string
};

export interface IBlockUser {
    blockedUsername: string
};

export interface IGetUsersBySearch {
    query: string
};

export interface IDeleteUser {
    id: number
};

// Posts
export interface IPost {
    body: string
    user: string
    username: string
    createdAt: string
    comments: IComment[]
    likes: ILike[]
};

export interface IGetSinglePost {
    id: string
};

export interface IGetPostsFromUser {
    username: string
};

export interface IGetPostsBySearch {
    query: string
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

export interface IProfile {
    _id: string
    profileName: string
    bio: string
    profileImage: string
    user: string
};

export interface IGetProfile {
    username: string
};

export interface IAddProfile {
    profileName: string
    userId: string
};

export interface IEditProfile {
    userId: string
    profileName: string
    bio: string
    profileImage: string
};

// Follower

export interface IFollower {
    _id: string
    username: string
    image: string
};

export interface IFollowUser {
    followingUsername: string
    followedUsername: string
};