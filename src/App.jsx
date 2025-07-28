import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import ResourceGrid from "./components/ResourceGrid";
import CharacterGrid from "./components/CharacterGrid";
import useDebounce from "./utils/useDebounce";
import { DataCacheProvider } from "./context/DataCacheContext";

const App = () => {
  const [resourceType, setResourceType] = useState("people");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);

  return (
    <DataCacheProvider>
      <div className="min-h-screen bg-gray-100">
        <Navbar current={resourceType} onChange={setResourceType} />
        
        {/* ✅ Centered Search Bar */}
        <div className="flex justify-center mt-4 mb-2">
          <div className="w-full max-w-md px-4">
            <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
        </div>

        {/* ✅ Conditional Grid */}
        {resourceType === "people" ? (
          <CharacterGrid searchTerm={debouncedSearch} />
        ) : (
          <ResourceGrid
            resourceType={resourceType}
            searchTerm={debouncedSearch}
          />
        )}
      </div>
    </DataCacheProvider>
  );
};

export default App;
