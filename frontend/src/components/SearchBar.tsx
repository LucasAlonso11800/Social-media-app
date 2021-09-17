import React from 'react';
// Components
import { Input, Button, Icon, Popup } from 'semantic-ui-react';

type Props = {
    loading: boolean
    searchData: () => void
    query: string
    setQuery: React.Dispatch<React.SetStateAction<string>>
};

export default function SearchBar(props: Props) {
    const { loading, searchData, query, setQuery } = props

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
                        onClick={() => searchData()}
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
        </div>
    )
}
