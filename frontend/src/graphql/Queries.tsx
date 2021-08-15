import { gql } from '@apollo/client';

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
            }
        }
    }
`