import React, { useState } from "react";
import MaterialSymbolsSearchRounded from "../../icons/MaterialSymbolsSearchRounded.jsx";

export const Search = ({ searchInitialized }) => {
  const [keywords, setKeywords] = useState("");
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
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  return (
    <div class="flex flex-col w-72 h-full border-gray-400 rounded-lg border-2">
      {/* Search input and button */}
      <div class="flex h-fit w-full p-2">
        <input
          type="text"
          className="input input-bordered flex-grow"
          value={keywords}
          onChange={handleInputChange}
          placeholder="Enter keywords"
          disabled={loading || !searchInitialized}
        />

        <div class="flex-fit self-center p-2">
          <MaterialSymbolsSearchRounded
            onClick={handleSearch}
            class="cursor-pointer"
            disabled={loading || !searchInitialized}
          />
        </div>
      </div>

      {/* Search results */}
      <div class="flex flex-grow flex-col w-full p-2 space-y-2 overflow-y-auto">
        {searchResults.length > 0 &&
          searchResults.map((result, index) => (
            // TODO: Display message sender and timestamp
            <div
              key={index}
              className="card w-full bg-base-100 shadow-xl rounded-lg"
            >
              <div className="card-body p-2 ">
                <p>{truncateText(result, 100)}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
