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
    userId: number
    image: string
};

export interface IGetUser {
    username: string
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
    username: string
};

// Comments
export interface IComment {
    _id: string
    body: string
    username: string
    createdAt: string
};

export interface IAddComment {
    postId: string
    body: string
};

export interface IDeleteComment {
    commentId: number
    username: string
};

// Likes
export interface ILike {
    like_id: number
    like_user_id: number
    like_post_id: number | null
    like_comment_id: number | null
    like_type: "P" | "C"
};

export interface ILikePostOrComment {
    postId: number
    commentId: number
    type: "P" | "C"
};

export interface IGetLikeStatus extends ILikePostOrComment{
    userId: string
};

export interface IGetLikeList extends ILikePostOrComment {}

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
    profileId: number
    userId: number
    profileName: string
    profileImage: string | null
    bio: string
};

// Follower

export interface IFollowRelation {
    follower_id: number
    followee_id: number
};

export interface IFollowUser {
    followerId: string
    followeeId: string
};

export interface IGetFollowStatus extends IFollowUser {};

export interface IGetFollowList {
    followeeId: string
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

export interface IBlockUser {
    blockingUserId: number
    blockedUserId: number
};

export interface IGetBlockStatus extends IBlockUser {};

// Images

export interface IImage {
    image_id: number
    image_type: "U" | "P"
    image_user_id: number
    image_profile_id: number
    image_image: string
}