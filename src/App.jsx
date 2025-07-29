import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import ResourceGrid from "./components/ResourceGrid";
import { DataCacheProvider, useDataCache } from "./context/DataCacheContext";

const DataPreloader = ({ children }) => {
  const { setResourceData, cache } = useDataCache();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  useEffect(() => {
    if (hasAttemptedLoad) {
      setIsLoading(false);
      return;
    }

    const preloadAllData = async () => {
      const resourceTypes = [
        "people",
        "films",
        "species",
        "vehicles",
        "starships",
        "planets",
      ];

      const currentCache = cache;
      const allDataCached = resourceTypes.every(
        (type) =>
          currentCache[type] && Object.keys(currentCache[type]).length > 0
      );

      if (allDataCached) {
        console.log("All data already cached, skipping fetch");
        setIsLoading(false);
        setHasAttemptedLoad(true);
        return;
      }

      try {
        console.log("Loading Star Wars data for the first time...");

        const promises = resourceTypes.map(async (type) => {
          if (
            currentCache[type] &&
            Object.keys(currentCache[type]).length > 0
          ) {
            console.log(`${type} already cached, skipping`);
            return { type, data: [], skipped: true };
          }

          console.log(`Fetching ${type}...`);
          const response = await fetch(`https://swapi.info/api/${type}`);
          const data = await response.json();
          console.log(
            `${type} fetched:`,
            data.results?.length || data.length,
            "items"
          );
          return { type, data: data.results || data, skipped: false };
        });

        const results = await Promise.all(promises);

        results.forEach(({ type, data, skipped }) => {
          if (!skipped && data.length > 0) {
            console.log(`Caching ${type}:`, data.length, "items");
            setResourceData(type, data);
          }
        });

        setIsLoading(false);
        setHasAttemptedLoad(true);
        console.log("Data loading complete!");
      } catch (error) {
        console.error("Failed to preload data:", error);
        setIsLoading(false);
        setHasAttemptedLoad(true);
      }
    };

    preloadAllData();
  }, [setResourceData, hasAttemptedLoad]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading Star Wars data...</p>
          <p className="text-sm text-gray-500 mt-2">
            This happens only once...
          </p>
        </div>
      </div>
    );
  }

  return children;
};

function App() {
  const [currentResourceType, setCurrentResourceType] = useState("people");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <DataCacheProvider>
      <DataPreloader>
        <div className="min-h-screen bg-gray-100">
          <Navbar
            current={currentResourceType}
            onChange={setCurrentResourceType}
          />

          <div className="container mx-auto px-4 py-6">
            <div className="mb-6 max-w-md mx-auto">
              <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            </div>

            <ResourceGrid
              resourceType={currentResourceType}
              searchTerm={searchTerm}
            />
          </div>
        </div>
      </DataPreloader>
    </DataCacheProvider>
  );
}

export default App;
