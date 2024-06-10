import React, { useState } from 'react';
import StreamlineSearch from "../../icons/StreamlineSearch.jsx";

export const Search = ({ searchInitialized }) => {
    const [keywords, setKeywords] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (event) => {
        setKeywords(event.target.value);
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const results = await window.vectorDB.search(keywords);
            setSearchResults(results);
        } catch (error) {
            console.error('Error searching:', error);
        } finally {
            setLoading(false);
        }
    };

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    return (
        <div class="flex flex-col w-72 p-4 space-y-4 h-full bg-base-200">

            {/* Search input and button */}
            <div class="flex h-fit w-full space-x-2">
                <input
                    type="text"
                    className="input input-bordered flex-grow h-10 rounded-lg"
                    value={keywords}
                    onChange={handleInputChange}
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {handleSearch()}
                    }}
                    placeholder="Enter keywords"
                    disabled={loading || !searchInitialized}
                />

                <button class="flex-fit self-center p-2 h-10 rounded-lg text-token-text-secondary focus-visible:outline-0 hover:bg-base-100 focus-visible:bg-base-100">
                    <StreamlineSearch onClick={handleSearch} class="cursor-pointer" disabled={loading || !searchInitialized} />
                </button>
            </div>

            {/* Search results */}
            <div class="flex flex-grow flex-col w-full space-y-2 overflow-y-auto">
                {searchResults.length > 0 && (
                    searchResults.map((result, index) => (
                        // TODO: Display message sender and timestamp
                        <div key={index} className="card w-full bg-base-100 shadow rounded-lg">
                            <div className="card-body p-2 ">
                                <p>{truncateText(result, 100)}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}