import { useEffect, useState } from "react";
import { SWAPI_URL } from "./constants";

const useSwAPIData = () => {
  const [characterData, setCharacterData] = useState([]);
  const fetchCharData = async () => {
    const data = await fetch(SWAPI_URL);
    const dataJson = await data.json();
    // console.log("Datafrom API", dataJson);
    setCharacterData(dataJson);
  };

  useEffect(() => {
    fetchCharData();
  }, []);

  //   console.log(characterData);
  return { characterData };
};

export default useSwAPIData;

// const useSwAPIData = () => {
//   const [characterData, setCharacters] = useState([]);
//   const [selectedChar, setSelectedChar] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const fetchCharData = async () => {
//     setIsLoading(true);
//     try {
//       const res = await fetch("https://swapi.info/api/people");
//       setCharacters(res.data.results);
//     } catch (err) {
//       console.error("Error fetching characters", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCharData();
//   }, []);

//   //   console.log(characterData);
//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h1 className="text-3xl font-bold mb-6">Star Wars Explorer</h1>

//       {isLoading ? (
//         <p>Loading characters...</p>
//       ) : (
//         <CharacterList characters={characterData} onView={setSelectedChar} />
//       )}

//       {selectedChar && (
//         <CharacterModal
//           character={selectedChar}
//           onClose={() => setSelectedChar(null)}
//         />
//       )}
//     </div>
//   );
// };

// export default useSwAPIData;
