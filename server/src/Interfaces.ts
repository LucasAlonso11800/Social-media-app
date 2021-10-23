import express from 'express';

export interface IContext {
    headers: typeof express.request.headers,
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
    id: number
    email: string
    username: string
    password: string
    country: string
    city: string
    birthDate: string
};

// Posts
export interface IPost {
    body: string
    user: string
    username: string
    createdAt: string
};

// Likes
export interface ILike {
    like_id: number
    like_user_id: number
    like_post_id: number | null
    like_comment_id: number | null
    like_type: "P" | "C"
};

// Profile

export interface IProfile {
    id: string
    profileName: string
    profileImage: string
    bio: string
    username: string
    city: string
    country: string
    birthDate: string
};

export interface IAddProfile {
    userId: string
    profileName: string
};

// Follower

export interface IFollowRelation {
    follower_id: number
    followee_id: number
};

// Blocked

export interface IBlocked {
    id: string
    username: string
};

export interface IBlockRelation {
    blocking_user_id: number
    blocked_user_id: number
};

// Images

export interface IImage {
    image_id: number
    image_type: "U" | "P"
    image_user_id: number
    image_profile_id: number
    image_image: string
};