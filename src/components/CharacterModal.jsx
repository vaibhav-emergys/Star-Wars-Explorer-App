import React, { useState } from "react";
import CharacterCard from "./CharacterCard";
import ResourceModal from "./ResourceModal";

const CharacterModal = ({ character, onClose }) => {
  const [selectedResource, setSelectedResource] = useState(null);

  // Add null check - don't render anything if no character
  if (!character) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-40">
        <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-xl max-h-[90%] overflow-y-auto relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-black"
          >
            ✖
          </button>
          <CharacterCard
            character={character}
            isExpanded={true}
            onToggle={onClose}
            onResourceClick={(resource) => setSelectedResource(resource)}
          />
        </div>
      </div>

      {selectedResource && (
        <ResourceModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onResourceClick={(resource) => setSelectedResource(resource)}
        />
      )}
    </>
  );
};

export default CharacterModal;
