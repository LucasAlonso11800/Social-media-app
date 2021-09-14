import { gql } from '@apollo/client';

export const ADD_USER = gql`
    mutation add_user(
        $username: String!
        $password: String!
        $confirmPassword: String!
        $email: String!
        $country: String!
        $city: String!
        $birthDate: String!
    ) {
        add_user(
            username: $username,
            password: $password
            confirmPassword: $confirmPassword
            email: $email,
            country: $country,
            city: $city,
            birthDate: $birthDate,
        ){
            id
            username
            token
        }
    }
`;

export const LOGIN_USER = gql`
    mutation login_user(
        $username: String!
        $password: String!
    ) {
        login_user(
            username: $username,
            password: $password
        ){
            id
            username
            token
        }
    }
`;

export const EDIT_USER_IMAGE = gql`
    mutation edit_user_image($image: String, $userId: ID!){
        edit_user_image(image: $image, userId: $userId)
    }
`;

export const BLOCK_USER = gql`
    mutation block_user($blockingUserId: ID!, $blockedUserId: ID!){
        block_user(blockingUserId: $blockingUserId, blockedUserId: $blockedUserId){
            isBlocking
        }
    }
`;

export const DELETE_USER = gql`
    mutation delete_user($username: String!){
        delete_user(username: $username){
            username
        }
    }
`;

// Posts

export const CREATE_POST = gql`
    mutation create_post($body: String!){
        create_post(body: $body){
            id
            body
            username
            createdAt
            comments{
                id
                username
                body
                createdAt
                likes {
                    id
                    username
                    createdAt
                }
            }
            likes {
                id
                username
                createdAt
            }
        }
    }
`;

export const DELETE_POST = gql`
    mutation delete_post($postId: ID!){
        delete_post(postId: $postId)
    }
`;

export const LIKE_POST_OR_COMMENT = gql`
    mutation like_post_or_comment(
        $postId: ID,
        $commentId: ID,
        $type: String!
        ){
        like_post_or_comment(
            postId: $postId,
            commentId: $commentId,
            type: $type
            ){
            liked
            count
        }
    }
`;

// Comments

export const ADD_COMMENT = gql`
    mutation add_comment($postId: ID!, $body: String!){
        add_comment(postId: $postId, body: $body){
            id
            comments{
                id
                body
                createdAt
                username
                likes {
                    id
                    username
                    createdAt
                }
            }
        }
    }
`;

export const DELETE_COMMENT = gql`
    mutation delete_comment($commentId: ID!, $postId: ID!){
        delete_comment(commentId: $commentId, postId: $postId) {
            id
            comments{
                id
                username
                createdAt
                body
                likes {
                    id
                    username
                    createdAt
                }
            }
        }   
    }  
`;

// Profiles

export const EDIT_PROFILE = gql`
    mutation edit_profile(
        $profileId: ID!,
        $userId: ID!, 
        $profileName: String!, 
        $profileImage: String, 
        $bio: String!
    ){
        edit_profile(
            profileId: $profileId,
            userId: $userId, 
            profileName: $profileName, 
            profileImage: $profileImage, 
            bio: $bio
        ){
            id
            profileName
            profileImage
            bio
            username
            city
            country
            birthDate
        }
    }
`;

// Followers

export const FOLLOW_USER = gql`
    mutation follow_user(
        $followerId: ID!, 
        $followeeId: ID!
    ){
        follow_user(
            followerId: $followerId, 
            followeeId: $followeeId
            ){
                follows
                followerCount
                followeeCount
            }
        }
`;