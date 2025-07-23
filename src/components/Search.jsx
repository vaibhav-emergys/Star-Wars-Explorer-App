const Search = () => {
  return (
    <div>
      <input
        className="border-2 border-solid m-4 p-3"
        type="text"
        name="example"
        placeholder="Search"
      />
      <button className="m-4 p-2 border-2 rounded-md bg-blue-500">
        Search
      </button>
    </div>
  );
};

export default Search;
