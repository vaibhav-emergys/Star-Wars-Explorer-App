import React, { useState, useEffect } from "react";
import useSwAPIData from "../utils/useSWAPIData";
import ResourceCard from "./ResourceCard";
import Pagination from "./Pagination";
import { useDataCache } from "../context/DataCacheContext";
import ResourceModal from "./ResourceModal";

const ResourceGrid = ({ resourceType, searchTerm }) => {
  const { setResourceData } = useDataCache();
  const { data, loading, error } = useSwAPIData(resourceType, setResourceData);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [resourceType]);

  const filtered = data.filter((item) => {
    const value = item.name || item.title || "";
    return value.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const currentItems = filtered.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const handleCloseAll = () => {
    setSelectedItem(null);
  };

  if (loading) return <p className="text-center p-8">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500 p-8">Error: {error}</p>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 justify-items-center">
        {currentItems.map((item) => (
          <ResourceCard
            key={item.url}
            item={item}
            onClick={setSelectedItem}
            onResourceClick={setSelectedItem}
            isExpanded={false}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filtered.length / itemsPerPage)}
        onPageChange={setCurrentPage}
      />
      {selectedItem && (
        <ResourceModal
          resource={selectedItem}
          onClose={() => setSelectedItem(null)}
          onResourceClick={(resource) => setSelectedItem(resource)}
          onCloseAll={handleCloseAll}
          isNested={false}
          navigationHistory={[]}
        />
      )}
    </div>
  );
};

export default ResourceGrid;
