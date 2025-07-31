import React from "react";
import { useDataCache } from "../context/DataCacheContext";
import {
  PERSON_FIELDS,
  FILM_FIELDS,
  SPECIES_FIELDS,
  VEHICLE_STARSHIP_FIELDS,
  PLANET_FIELDS,
} from "../utils/constants";

const ResourceCard = ({
  item,
  onClick,
  onResourceClick,
  isExpanded = false,
}) => {
  const { getResourceById } = useDataCache();

  if (!item) return null;

  const getCollapsedFields = (item) => {
    if (item.birth_year || item.height || item.gender) {
      return PERSON_FIELDS;
    }
    if (item.title && item.episode_id !== undefined) {
      return FILM_FIELDS;
    }
    if (item.classification || item.designation) {
      return SPECIES_FIELDS;
    }
    if (item.model || item.manufacturer) {
      return VEHICLE_STARSHIP_FIELDS;
    }
    if (item.rotation_period || item.orbital_period) {
      return PLANET_FIELDS;
    }
    return ["name", "title"];
  };

  const collapsedFields = getCollapsedFields(item);

  const formatKey = (key) =>
    key
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const renderLink = (url) => {
    const parts = url.split("/").filter(Boolean);
    const type = parts[parts.length - 2];
    const id = parts[parts.length - 1];

    const cachedData = getResourceById(type, id);

    const displayName =
      cachedData?.title ||
      cachedData?.name ||
      `${type.charAt(0).toUpperCase() + type.slice(1, -1)} ${id}`;

    return (
      <button
        key={url}
        className="bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full shadow-sm hover:bg-indigo-200 transition cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onResourceClick(cachedData || { url });
        }}
      >
        {displayName}
      </button>
    );
  };

  const renderValue = (key, value) => {
    if (Array.isArray(value)) {
      return (
        <div key={key} className="mb-4">
          <div className="text-xs text-gray-500 font-medium mb-1">
            {formatKey(key)}
          </div>
          <div className="flex flex-wrap gap-2">
            {value.length === 0 ? (
              <span className="text-gray-400 text-sm">Not Available</span>
            ) : (
              value.map((url) => renderLink(url))
            )}
          </div>
        </div>
      );
    } else if (typeof value === "string" && value.startsWith("http")) {
      return (
        <div key={key} className="mb-4">
          <div className="text-xs text-gray-500 font-medium mb-1">
            {formatKey(key)}
          </div>
          <div>{renderLink(value)}</div>
        </div>
      );
    } else {
      return (
        <div key={key} className="mb-4">
          <div className="text-xs text-gray-500 font-medium mb-1">
            {formatKey(key)}
          </div>
          <div className="text-sm text-gray-800">{String(value)}</div>
        </div>
      );
    }
  };

  const visibleEntries = Object.entries(item).filter(([key]) =>
    isExpanded
      ? !["url", "created", "edited"].includes(key)
      : collapsedFields.includes(key)
  );

  return (
    <div
      className={`p-0 bg-transparent shadow-none w-full ${
        isExpanded
          ? ""
          : "bg-white rounded-xl shadow-md p-6 max-w-[300px] cursor-pointer hover:shadow-lg hover:scale-[1.01] transition"
      }`}
      onClick={!isExpanded ? () => onClick?.(item) : undefined}
    >
      <h2 className="text-lg font-semibold text-indigo-700 mb-4">
        {item.name || item.title || "Unnamed Resource"}
      </h2>

      <div className="text-sm text-gray-800 space-y-2">
        {visibleEntries.map(([key, val]) => renderValue(key, val))}
      </div>
    </div>
  );
};

export default ResourceCard;
