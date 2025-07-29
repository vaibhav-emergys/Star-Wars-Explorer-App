import React from "react";

const Navbar = ({ current, onChange }) => {
  const types = [
    "people",
    "films",
    "species",
    "vehicles",
    "starships",
    "planets",
  ];

  return (
    <nav className="flex flex-wrap gap-3 justify-center bg-gradient-to-r from-indigo-800 to-indigo-600 p-4 text-white shadow-md rounded-b-lg">
      {types.map((type) => (
        <button
          key={type}
          className={`px-4 py-2 rounded transition font-medium text-sm ${
            current === type
              ? "bg-white text-indigo-600"
              : "hover:bg-indigo-500"
          }`}
          onClick={() => onChange(type)}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </nav>
  );
};

export default Navbar;
