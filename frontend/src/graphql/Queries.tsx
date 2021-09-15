import { gql } from '@apollo/client';

// Posts

export const GET_HOME_PAGE_POSTS = gql`
    query($userId: ID){
        home_page_posts(userId: $userId){
            postId
            body
            createdAt
            username
            profileName
            userId
        }
    }
`;

export const GET_SINGLE_POST = gql`
    query($id: ID!){
        single_post(id: $id){
            postId
            body
            createdAt
            userId
            username
            profileName
        }
    }
`;

export const GET_POSTS_FROM_USER = gql`
    query($userId: ID!){
        posts_from_user(userId: $userId){
            postId
            body
            createdAt
            username
            profileName
            userId
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
    query($userId: ID){
        user_image(userId: $userId)
    }
`;

export const GET_PROFILE = gql`
    query($userId: ID!){
        profile(userId: $userId){
            profileName
            profileImage
            bio
            username
            city
            country
            birthDate
            id
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

// Likes

export const GET_LIKE_STATUS = gql`
    query(
        $commentId: ID,
        $postId: ID,
        $userId: ID,
        $type: String!
        ){
        like_status(
            commentId: $commentId,
            postId: $postId,
            userId: $userId,
            type: $type
            ){
                count
                liked
            }
        }
`;

// Followers 
export const GET_FOLLOW_STATUS = gql`
    query($followerId: ID, $followeeId: ID!){
        follow_status(followerId: $followerId, followeeId: $followeeId){
            follows
            followerCount
            followeeCount
        }
    }  
`;

// Comments

export const GET_COMMENT_COUNT = gql`
    query($postId: ID!){
        comment_count(postId: $postId)
    }
`;

export const GET_COMMENTS_FROM_POSTS = gql`
    query($postId: ID!){
        comments_from_posts(postId: $postId){
            id
            body
            username
            profileName
            createdAt
        }
    }
`;

// Blocks

export const GET_BLOCK_STATUS = gql`
    query($blockingUserId: ID, $blockedUserId: ID!){
        block_status(
            blockingUserId: $blockingUserId,
            blockedUserId: $blockedUserId
        ){
            isBlocking
            isBlocked
        }
    }
`;