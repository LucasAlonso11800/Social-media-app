import { gql } from '@apollo/client';

// Posts
export const GET_POSTS = gql`
    {
        all_posts {
            id
            body
            username
            createdAt
            likes {
                username
            }
            comments {
                id
                body
                username
                createdAt
            }
        }
    }
`;

export const GET_SINGLE_POST = gql`
    query($id: ID!){
        single_post(id: $id){
            id
            body
            createdAt
            username
            comments{
                id
                body
                username
                createdAt
            }
            likes {
                id
                username
            }
        }
    }
`;

export const GET_POSTS_FROM_USER = gql`
    query($username: String!){
        posts_from_user(username: $username){
            id
            body
            createdAt
            username
            comments{
                id
                body
                username
                createdAt
            }
            likes {
                id
                username
            }
        }
    }
`;

export const GET_POSTS_BY_SEARCH = gql`
    query($query: String!){
        posts_by_search(query: $query){
            id
            body
            createdAt
            username
            comments{
                id
                body
                username
                createdAt
            }
            likes {
                id
                username
            }
        }
    }  
`;

// Users
export const GET_USER_IMAGE = gql`
    query($username: String!){
        user_image(username: $username){
            image
        }
    }
`;

export const GET_BLOCKED_USERS = gql`
    query($username: String!){
        blocked_users(username: $username){
            blockedUsers{
                username
            }
        }
    }
`;

export const GET_PROFILE = gql`
    query($username: String!){
        profile(username: $username){
            profileName
            profileImage
            bio
            user{
                id
                username
                country
                city
                birthDate
                followers{
                    username
                }
                following{
                    username
                }
                image
                blockedUsers{
                    username
                }
            }
        }
    }
`;

export const GET_USERS_BY_SEARCH = gql`
    query($query: String!){
        users_by_search(query: $query){
            id
            username
            city
            country
            birthDate
            followers{
                username
            }
            following{
                username
            }
        }
    }
`;