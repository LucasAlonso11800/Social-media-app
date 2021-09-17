import React, { useEffect, useState } from "react";
// GraphQL
import { useLazyQuery } from "@apollo/client";
import { GET_POSTS_BY_SEARCH, GET_USERS_BY_SEARCH } from "../graphql/Queries";
// Components
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Container } from "semantic-ui-react";
import SearchBar from "../components/SearchBar";
import UserCard from "../components/UserCard";
import PostCard from "../components/PostCard";
// Interfaces
import { IPost, IUserData } from "../Interfaces";
// Helpers
import { handleError } from "../helpers/handleError";

type QueryResult = {
    users_by_search: IUserData[],
    posts_by_search: IPost[],
};

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4,
        slidesToSlide: 2 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    }
};

export default function SearchPage() {
    const [query, setQuery] = useState<string>(localStorage.getItem("query") || '');

    const [searchUsers, { loading: usersLoading, data: usersData }] = useLazyQuery<Pick<QueryResult, "users_by_search">>(GET_USERS_BY_SEARCH, {
        onError: (error): unknown => handleError(error, undefined)
    });

    const [searchPosts, { loading: postsLoading, data: postsData }] = useLazyQuery<Pick<QueryResult, "posts_by_search">>(GET_POSTS_BY_SEARCH, {
        onError: (error): unknown => handleError(error, undefined)
    });

    const searchData = (): void => {
        localStorage.setItem('query', query);
        searchUsers({ variables: { query } });
        searchPosts({ variables: { query } });
    };

    useEffect(() => {
        if(localStorage.getItem("query")) searchData()
    }, [])

    return (
        <Container>
            <SearchBar query={query} setQuery={setQuery} loading={usersLoading || postsLoading} searchData={searchData} />
            {!usersLoading && usersData !== undefined &&
                <div className="search-page__container">
                    <h2>Users</h2>
                    <Carousel
                        swipeable={false}
                        draggable={false}
                        showDots={true}
                        responsive={responsive}
                        keyBoardControl={true}
                        infinite={true}
                        autoPlay={false}
                        customTransition="all 1"
                        transitionDuration={1000}
                        removeArrowOnDeviceType={["tablet", "mobile"]}
                    >
                        {usersData.users_by_search.map((user) => {
                            return <UserCard user={user} key={user.id} />
                        })}
                    </Carousel>
                </div>
            }
            {!postsLoading && postsData !== undefined &&
                <div className="search-page__container">
                    <h2>Posts</h2>
                    {
                        postsData.posts_by_search.map((post) => {
                            return <PostCard post={post} key={post.postId} />
                        })
                    }
                </div>
            }
        </Container>
    )
}