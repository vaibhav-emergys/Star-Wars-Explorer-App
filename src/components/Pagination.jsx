import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center mt-10 mb-6 space-x-6">
      <button
        className="flex items-center justify-center w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow disabled:opacity-40 transition"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="Previous Page"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      <span className="text-sm font-medium text-gray-700 flex items-center">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className="flex items-center justify-center w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow disabled:opacity-40 transition"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title="Next Page"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
