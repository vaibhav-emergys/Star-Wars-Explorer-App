import CharacterGrid from "./components/CharacterGrid";
import Search from "./components/Search";
function App() {
  return (
    <>
      <div>
        {/* Search  */}
        <Search />
      </div>
      <div>
        {/* cards */}
        <CharacterGrid />
      </div>
    </>
  );
}

export default App;
