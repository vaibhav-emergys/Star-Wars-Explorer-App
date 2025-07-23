import { useState } from "react";
import useSwAPIData from "../utils/useSwapData";
import CharacterCard from "./CharacterCard";
import Pagination from "./Pagination";

const CharacterGrid = () => {
  const { characterData } = useSwAPIData();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCharacters = characterData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(characterData.length / itemsPerPage);
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {currentCharacters.map((char) => {
          return <CharacterCard key={char.url} character={char} />;
        })}
      </div>
      <div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default CharacterGrid;
