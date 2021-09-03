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
            email
            username
            token
            country
            city
            birthDate
            followers{
                username
                image
            }
            following{
                username
                image
            }
            blockedUsers{
                username
            }
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
            email
            username
            token
            country
            city
            birthDate
            followers{
                username
                image
            }
            following{
                username
                image
            }
            blockedUsers{
                username
            }
        }
    }
`;

export const EDIT_USER_IMAGE = gql`
    mutation edit_user_image($image: String){
        edit_user_image(image: $image){
            username
        }
    }
`;

export const BLOCK_USER = gql`
    mutation block_user($blockedUsername: String!){
        block_user(blockedUsername: $blockedUsername){
            blockedUsers{
                username
            }
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

export const LIKE_POST = gql`
    mutation like_post($postId: ID!){
        like_post(postId: $postId){
            id
            likes{
                id
                username
            }
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

export const ADD_PROFILE = gql`
    mutation add_profile($userId: String!, $profileName: String!){
        add_profile(userId: $userId, profileName: $profileName){
            profileName
        }
    }
`;

export const EDIT_PROFILE = gql`
    mutation edit_profile(
        $userId: String!, 
        $profileName: String!, 
        $profileImage: String, 
        $bio: String!
    ){
        edit_profile(
            userId: $userId, 
            profileName: $profileName, 
            profileImage: $profileImage, 
            bio: $bio
        ){
            id
            profileName
            profileImage
            bio
        }
    }
`;

// Followers

export const FOLLOW_USER = gql`
    mutation follow_user(
        $followingUsername: String!, 
        $followedUsername: String!
    ){
        follow_user(
            followingUsername: $followingUsername, 
            followedUsername: $followedUsername
            )
        {
           following {
               username
           }
        }
    }
`;