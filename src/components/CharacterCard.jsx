import React from "react";
import { useDataCache } from "../context/DataCacheContext";

const CharacterCard = ({
  character,
  isExpanded,
  onToggle,
  onResourceClick,
}) => {
  const { getResourceById } = useDataCache();

  // Add null check
  if (!character) {
    return null;
  }

  // These are the ONLY fields shown when collapsed
  const collapsedFields = [
    "name",
    "title",
    "gender",
    "birth_year",
    "height",
    "mass",
    "skin_color",
    "hair_color",
    "eye_color",
  ];

  // Helper to format keys nicely
  const formatKey = (str) =>
    str
      .split("_")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");

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

  const renderField = (key, value) => {
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
    }

    if (typeof value === "string" && value.startsWith("http")) {
      return (
        <div key={key} className="mb-2">
          <strong>{formatKey(key)}:</strong> {renderLink(value)}
        </div>
      );
    }

    return (
      <div key={key} className="mb-2">
        <strong>{formatKey(key)}:</strong> {String(value)}
      </div>
    );
  };

  // Get entries to display based on expanded state
  let visibleEntries;

  if (isExpanded) {
    // When expanded, show everything except url, created, edited
    visibleEntries = Object.entries(character).filter(
      ([key]) => !["url", "created", "edited"].includes(key)
    );
  } else {
    // When collapsed, ONLY show the basic fields
    visibleEntries = Object.entries(character).filter(([key]) =>
      collapsedFields.includes(key)
    );
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm w-full max-w-sm ${
        isExpanded
          ? ""
          : "cursor-pointer hover:shadow-md transition duration-200 ease-in-out"
      }`}
      onClick={!isExpanded ? onToggle : undefined}
    >
      <h2 className="text-xl font-bold mb-4">
        {character.name || character.title}
      </h2>
      <div className="text-sm text-gray-800">
        {visibleEntries.map(([key, value]) => renderField(key, value))}
      </div>
    </div>
  );
};

export default CharacterCard;
