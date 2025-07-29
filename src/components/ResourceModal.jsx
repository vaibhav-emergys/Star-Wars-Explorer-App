import React, { useEffect, useState } from "react";
import ResourceCard from "./ResourceCard";
import { useDataCache } from "../context/DataCacheContext";
import { XMarkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const ResourceModal = ({
  resource,
  onClose,
  onCloseAll,
  navigationHistory = [],
}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [modalStack, setModalStack] = useState([]);
  const { getResourceById } = useDataCache();

  useEffect(() => {
    if (!resource?.url) {
      if (resource && !resource.url) {
        setData(resource);
        return;
      }
      return;
    }

    const parts = resource.url.split("/").filter(Boolean);
    const type = parts[parts.length - 2];
    const id = parts[parts.length - 1];

    const cachedResource = getResourceById(type, id);
    if (cachedResource) {
      console.log(`Using cached resource for ${type}/${id}`);
      setData(cachedResource);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`Cache miss for ${type}/${id}, fetching from API...`);
        const res = await fetch(resource.url);
        if (!res.ok) throw new Error("Failed to fetch resource");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resource, getResourceById]);

  const handleResourceClick = (newResource) => {
    const currentData = data || resource;
    setModalStack((prev) => [...prev, currentData]);
    setSelectedResource(newResource);
  };

  const handleBack = () => {
    if (selectedResource) {
      setSelectedResource(null);
    } else if (modalStack.length > 0) {
      const previousResource = modalStack[modalStack.length - 1];
      const newStack = modalStack.slice(0, -1);

      setModalStack(newStack);
      setData(previousResource);
      setSelectedResource(null);
    } else {
      onClose();
    }
  };

  const handleCloseAll = () => {
    if (onCloseAll) {
      onCloseAll();
    } else {
      onClose();
    }
  };

  if (!resource) return null;

  const displayData = data || resource;
  const currentHistory = [...navigationHistory, ...modalStack, displayData];
  const hasNavigation =
    modalStack.length > 0 || navigationHistory.length > 0 || selectedResource;

  return (
    <>
      <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-40">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-xl max-h-[90%] overflow-y-auto relative">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <div className="flex gap-2">
              {hasNavigation && (
                <button
                  onClick={handleCloseAll}
                  className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  title="Close all modals and return to homepage"
                >
                  <XMarkIcon className="w-4 h-4" />
                  <span>Close All</span>
                </button>
              )}
            </div>

            <button
              onClick={hasNavigation ? handleBack : handleCloseAll}
              className="text-gray-600 hover:text-black text-xl"
              title={
                hasNavigation ? "Go back to previous resource" : "Close modal"
              }
            >
              {hasNavigation ? (
                <ArrowLeftIcon className="w-6 h-6 text-gray-600 hover:text-black" />
              ) : (
                <XMarkIcon className="w-6 h-6 text-gray-600 hover:text-black" />
              )}
            </button>
          </div>

          {currentHistory.length > 1 && (
            <div className="mb-4 text-sm text-gray-500">
              <div className="flex items-center gap-1 flex-wrap">
                {currentHistory.map((item, index) => (
                  <React.Fragment key={index}>
                    <span
                      className={
                        index === currentHistory.length - 1
                          ? "text-gray-800 font-medium"
                          : ""
                      }
                    >
                      {item?.name || item?.title || "Resource"}
                    </span>
                    {index < currentHistory.length - 1 && (
                      <span className="text-gray-400">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {loading && <p className="text-center p-4">Loading...</p>}
          {error && (
            <p className="text-center text-red-500 p-4">Error: {error}</p>
          )}
          {displayData && (
            <ResourceCard
              item={displayData}
              isExpanded={true}
              onResourceClick={handleResourceClick}
            />
          )}
        </div>
      </div>

      {selectedResource && (
        <ResourceModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onResourceClick={(resource) => setSelectedResource(resource)}
          onCloseAll={handleCloseAll}
          isNested={true}
          navigationHistory={currentHistory}
        />
      )}
    </>
  );
};

export default ResourceModal;
