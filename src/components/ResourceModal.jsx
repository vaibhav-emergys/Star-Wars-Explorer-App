import React, { useEffect, useState } from "react";

/**
 * Generic modal to fetch & display a SWAPI resource (film, vehicle, starship, etc.)
 */
const ResourceModal = ({ resource, onClose, onResourceClick }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!resource?.url) return;

    const fetchData = async () => {
      try {
        setLoading(true);
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
  }, [resource]);

  if (!resource) return null;

  const renderVal = (val) => {
    if (Array.isArray(val)) {
      if (val.length === 0)
        return <span className="text-gray-500">None</span>;
      return (
        <ul className="flex flex-wrap gap-2 mt-1">
          {val.map((item, idx) => (
            <li key={idx} className="break-all">
              {typeof item === "string" && item.startsWith("http") ? (
                <button
                  onClick={() => onResourceClick({ url: item })}
                  className="inline-block bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium transition-colors break-all"
                >
                  {item}
                </button>
              ) : (
                <span>{item.toString()}</span>
              )}
            </li>
          ))}
        </ul>
      );
    }

    if (typeof val === "string" && val.startsWith("http")) {
      return (
        <button
          onClick={() => onResourceClick({ url: val })}
          className="inline-block bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium transition-colors break-all"
        >
          {val}
        </button>
      );
    }

    return <span>{val.toString()}</span>;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-xl shadow-2xl max-w-md w-full p-6 overflow-y-auto max-h-[90vh] transform transition-all duration-300 hover:scale-[1.01]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-4">{resource.title || resource.name}</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {data && (
          <div className="space-y-1 text-sm">
            <div className="space-y-2">
              {Object.entries(data).map(([key, value]) => {
                if (["title", "name", "opening_crawl"].includes(key)) return null;
                return (
                  <p key={key} className="break-words">
                    <strong className="capitalize">
                      {key.replace(/_/g, " ")}:{" "}
                    </strong>
                    {renderVal(value)}
                  </p>
                );
              })}

              {data.opening_crawl && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-indigo-600 hover:underline font-medium">
                    Opening Crawl
                  </summary>
                  <div className="mt-2 max-h-60 overflow-y-auto bg-gray-50 p-3 rounded whitespace-pre-wrap leading-relaxed text-gray-700 text-sm">
                    {data.opening_crawl}
                  </div>
                </details>
              )}
            </div>
          </div>
        )}

        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ResourceModal;
