const CharacterCard = ({ character }) => {
  console.log(character);

  return (
    <div className="p-4 bg-white shadow-md rounded hover:shadow-lg transition border-1">
      <h1 className="text-xl font-semibold mb-2">{character.name}</h1>
      <p>Gender: {character.gender}</p>
      <p>Height: {character.height}</p>
      <p>Birth Year: {character.birth_year}</p>
    </div>
  );
};

export default CharacterCard;
