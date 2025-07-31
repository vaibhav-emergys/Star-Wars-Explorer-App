import { useEffect, useState } from "react";
import { useDataCache } from "../context/DataCacheContext";
import { SWAPI_URL } from "../utils/constants";

const useSwAPIData = (resource = "people", setResourceData) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cache } = useDataCache();

  const fetchAllPages = async (url) => {
    let results = [];
    let nextUrl = url;
    while (nextUrl) {
      const res = await fetch(nextUrl);
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      const newResults = Array.isArray(json) ? json : json.results ?? [];
      results = results.concat(newResults);
      nextUrl = json.next;
    }
    return results;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (cache[resource] && Object.keys(cache[resource]).length > 0) {
          console.log(`Using cached data for ${resource}`);
          const cachedData = Object.values(cache[resource]);
          setData(cachedData);
          setLoading(false);
          return;
        }

        console.log(`Cache miss for ${resource}, fetching from API...`);
        const allData = await fetchAllPages(`${SWAPI_URL}${resource}`);
        setData(allData);

        if (setResourceData) {
          setResourceData(resource, allData);
        }
      } catch (err) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resource, cache, setResourceData]);

  return { data, loading, error };
};

export default useSwAPIData;
