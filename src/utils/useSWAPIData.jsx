import { useEffect, useState } from "react";

const useSwAPIData = (resource = "people", setResourceData) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const allData = await fetchAllPages(`https://swapi.info/api/${resource}`);
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
  }, [resource]);

  return { data, loading, error };
};

export default useSwAPIData;