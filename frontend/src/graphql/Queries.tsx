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