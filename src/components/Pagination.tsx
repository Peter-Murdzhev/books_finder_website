'use client';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  setPage: (page: number) => void;
  scrollTo?: number;
};

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  setPage,
  scrollTo = 0,
}: PaginationProps) {
  if (totalPages <= 1 || totalItems === 0) return null;

  const handlePageChange = (page: number) => {
    setPage(page);
    // keep the timeout from your original for smooth UX after state updates
    setTimeout(() => window.scrollTo({ top: scrollTo, behavior: 'smooth' }), 100);
  };

  // Build the list of page numbers + ellipsis markers
  const pages: (number | 'ellipsis')[] = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  )
    .filter(
      (page) =>
        page === 1 ||
        page === totalPages ||
        (page >= currentPage - 1 && page <= currentPage + 1)
    )
    .reduce<(number | 'ellipsis')[]>((acc, page, idx, arr) => {
      if (idx > 0 && page - (arr[idx - 1] as number) > 1) {
        acc.push('ellipsis');
      }
      acc.push(page);
      return acc;
    }, []);

  const baseBtn =
    'px-3 py-1 border rounded cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="flex gap-2 items-center self-center mt-7 mb-10">
      {/* <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseBtn} border-gray-400 text-gray-700 hover:bg-gray-100`}
      >
        Previous
      </button> */}

      {pages.map((item, index) => {
        if (item === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-gray-500 select-none"
            >
              ...
            </span>
          );
        }

        const isActive = currentPage === item;
        return (
          <button
            key={item}
            onClick={() => handlePageChange(item)}
            className={`${baseBtn} ${
              isActive
                ? 'bg-cyan-700 text-white border-cyan-700'
                : 'border-gray-400 text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item}
          </button>
        );
      })}

      {/* <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${baseBtn} border-gray-400 text-gray-700 hover:bg-gray-100`}
      >
        Next
      </button> */}
    </div>
  );
}