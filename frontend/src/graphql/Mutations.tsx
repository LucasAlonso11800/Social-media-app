import { gql } from '@apollo/client';

export const ADD_USER = gql`
    mutation add_user(
        $username: String!
        $password: String!
        $confirmPassword: String!
        $email: String!
    ) {
        add_user(
            username: $username,
            password: $password
            confirmPassword: $confirmPassword
            email: $email,
        ){
            id
            email
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
            email
            username
            token
        }
    }
`;

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