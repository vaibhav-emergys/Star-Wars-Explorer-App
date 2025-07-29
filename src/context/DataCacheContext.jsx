import { createContext, useContext, useState } from "react";

const DataCacheContext = createContext();

// create a custom hook ---- DataCacheContext
export const useDataCache = () => useContext(DataCacheContext);

export const DataCacheProvider = ({ children }) => {
  const [cache, setCache] = useState({});

  const setResourceData = (type, dataArray) => {
    setCache((prev) => ({
      ...prev,
      [type]: Object.fromEntries(
        dataArray.map((item) => {
          const id = item.url.split("/").filter(Boolean).pop();
          return [id, item];
        })
      ),
    }));
  };

  const getResourceById = (type, id) => cache?.[type]?.[id] ?? null;

  return (
    <DataCacheContext.Provider
      value={{ setResourceData, getResourceById, cache }}
    >
      {children}
    </DataCacheContext.Provider>
  );
};
