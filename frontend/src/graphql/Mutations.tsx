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