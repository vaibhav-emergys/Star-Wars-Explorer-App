import React from "react";
import { useDataCache } from "../context/DataCacheContext";

const ResourceCard = ({ item, onClick, onResourceClick }) => {
  const { getResourceById } = useDataCache();

  const renderValue = (key, value) => {
    if (Array.isArray(value)) {
      return (
        <div key={key} className="mb-2">
          <strong className="block">{formatKey(key)}:</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {value.length === 0 ? (
              <span className="text-gray-500">None</span>
            ) : (
              value.map((url) => renderLink(url))
            )}
          </div>
        </div>
      );
    } else if (typeof value === "string" && value.startsWith("http")) {
      return (
        <div key={key} className="mb-2">
          <strong>{formatKey(key)}:</strong> {renderLink(value)}
        </div>
      );
    } else {
      return (
        <div key={key} className="mb-2">
          <strong>{formatKey(key)}:</strong> {String(value)}
        </div>
      );
    }
  };

  const renderLink = (url) => {
    const parts = url.split("/").filter(Boolean);
    const type = parts[parts.length - 2]; // e.g. "films"
    const id = parts[parts.length - 1]; // e.g. "1"

    const cachedData = getResourceById(type, id);

    const displayName =
      cachedData?.title || cachedData?.name || `${type}/${id}`;

    return (
      <button
        key={url}
        className="text-blue-600 underline text-sm hover:text-blue-800"
        onClick={(e) => {
          e.stopPropagation();
          onResourceClick(cachedData || { url });
        }}
      >
        {displayName}
      </button>
    );
  };

  const formatKey = (key) =>
    key
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <div
      className="p-4 bg-white border rounded shadow-md w-full max-w-sm cursor-pointer hover:shadow-lg transition"
      onClick={() => onClick?.(item)}
    >
      <h2 className="text-lg font-semibold mb-4">
        {item.name || item.title || "Unnamed"}
      </h2>
      <div className="text-sm text-gray-800">
        {Object.entries(item)
          .filter(([k]) => !["url", "created", "edited"].includes(k))
          .map(([key, val]) => renderValue(key, val))}
      </div>
    </div>
  );
};

export default ResourceCard;
