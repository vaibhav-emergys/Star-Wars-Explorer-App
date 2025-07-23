const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center m-10 p-4 space-x-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span className="text-lg font-semibold">
        page {currentPage} of {totalPages}
      </span>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
