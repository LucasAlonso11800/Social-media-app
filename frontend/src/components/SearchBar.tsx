import React from 'react';
// Components
import { Input, Select, Button, Icon, Popup } from 'semantic-ui-react';

type Props = {
    loading: boolean
    searchData: Function
    query: string
    setQuery: Function
    setLookingForPosts: Function
};

export default function SearchBar(props: Props) {
    const { loading, searchData, query, setQuery, setLookingForPosts } = props

    const options = [
        { key: 'p', value: 'p', text: 'Posts' },
        { key: 'u', value: 'u', text: 'Users' }
    ];

    return (
        <div className="search-bar">
            <Popup
                inverted
                content="Search"
                trigger={
                    <Button
                        as="div"
                        color="twitter"
                        disabled={loading}
                        onClick={() => searchData({ variables: { query } })}
                    >
                        <Icon name="search" />
                    </Button>
                }
            />
            <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Look for users or posts"
            />
            <Select onChange={(e) => setLookingForPosts(e.currentTarget.innerText === 'Posts' ? true : false)} defaultValue='p' options={options} />
        </div>
    )
}
