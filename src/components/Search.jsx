import React, { useState, useEffect } from "react";
import useDebounce from "../utils/useDebounce";

const Search = ({ searchTerm, onSearchChange }) => {
  const [inputValue, setInputValue] = useState(searchTerm);

  const debouncedSearchTerm = useDebounce(inputValue, 1000);

  useEffect(() => {
    onSearchChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchChange]);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
      />

      {inputValue !== debouncedSearchTerm && (
        <div className="text-xs text-gray-500 mt-1">Searching...</div>
      )}
    </div>
  );
};

export default Search;
