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