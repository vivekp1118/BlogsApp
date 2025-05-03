export const Pagination = ({
    totalPages,
    page,
    onPageChange,
    displayPages = 5
}) => {
    if (totalPages <= 1) return null;

    let startPage = Math.max(page - Math.floor((displayPages - 2) / 2), 2);
    let endPage = Math.min(startPage + (displayPages - 3), totalPages - 1);

    if (endPage - startPage + 1 < Math.min(displayPages - 2, totalPages - 2)) {
        if (startPage === 2) {
            endPage = Math.min(startPage + (displayPages - 3), totalPages - 1);
        } else {
            startPage = Math.max(endPage - (displayPages - 3), 2);
        }
    }

    const pageButtons = [];

    pageButtons.push(
        <button
            key={1}
            onClick={() => onPageChange(1)}
            className={`rounded-md px-4 py-2 text-sm transition hover:bg-gray-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                page === 1 ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
            }`}
        >
            1
        </button>
    );

    if (startPage > 2) {
        pageButtons.push(
            <span key="ellipsis-1" className="px-2">
                ...
            </span>
        );
    }

    for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
            <button
                key={i}
                onClick={() => onPageChange(i)}
                className={`rounded-md px-4 py-2 text-sm transition hover:bg-gray-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                    i === page
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700'
                }`}
            >
                {i}
            </button>
        );
    }

    if (endPage < totalPages - 1) {
        pageButtons.push(
            <span key="ellipsis-2" className="px-2">
                ...
            </span>
        );
    }

    if (totalPages > 1) {
        pageButtons.push(
            <button
                key={totalPages}
                onClick={() => onPageChange(totalPages)}
                className={`rounded-md px-4 py-2 text-sm transition hover:bg-gray-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                    page === totalPages
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-700'
                }`}
            >
                {totalPages}
            </button>
        );
    }

    return (
        <div className="mt-4 flex items-center justify-end gap-2 p-4">
            <button
                onClick={() => onPageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`rounded-md px-3 py-2 text-sm transition hover:bg-gray-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                    page === 1
                        ? 'cursor-not-allowed text-gray-400'
                        : 'text-gray-700 hover:bg-gray-200'
                }`}
            >
                &lt;
            </button>

            {pageButtons}

            <button
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className={`rounded-md px-3 py-2 text-sm transition hover:bg-gray-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                    page === totalPages
                        ? 'cursor-not-allowed text-gray-400'
                        : 'text-gray-700 hover:bg-gray-200'
                }`}
            >
                &gt;
            </button>
        </div>
    );
};
