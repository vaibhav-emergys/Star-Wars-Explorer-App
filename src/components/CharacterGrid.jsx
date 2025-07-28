import { useState } from "react";
import useSwAPIData from "../utils/useSWAPIData";
import CharacterCard from "./CharacterCard";
import Pagination from "./Pagination";
import CharacterModal from "./CharacterModal";

const CharacterGrid = ({ searchTerm }) => {
  const { data: characterData, loading, error } = useSwAPIData("people");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const itemsPerPage = 8;

  // guard when loading or error
  const filteredCharacters = characterData.filter((char) =>
    char.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCharacters = filteredCharacters.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredCharacters.length / itemsPerPage);

  if (loading) {
    return <p className="text-center p-8">Loading characters...</p>;
  }

  if (error) {
    return (
      <p className="text-center text-red-500 p-8">Error: {error}</p>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 p-6 [grid-auto-rows:min-content] justify-items-center">
      
        {currentCharacters.map((char) => (
          <CharacterCard
            key={char.url}
            character={char}
            isExpanded={false}
            onToggle={() => setSelectedCharacter(char)}
          />
        ))}
      </div>
      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      {/* Detail Modal */}
      <CharacterModal
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
      />
    </div>
  );
};

export default CharacterGrid;
