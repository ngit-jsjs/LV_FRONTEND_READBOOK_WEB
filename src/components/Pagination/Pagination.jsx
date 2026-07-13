import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-wrapper">
      <button
        className="pagination-btn"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(1)}
        title="Trang Đầu"
      >
        &laquo; Đầu
      </button>
      <button
        className="pagination-btn"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        title="Trang Trước"
      >
        Trước
      </button>

      <span className="pagination-info">Trang {currentPage} / {totalPages}</span>

      <button
        className="pagination-btn"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        title="Trang Sau"
      >
        Sau
      </button>
      <button
        className="pagination-btn"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(totalPages)}
        title="Trang Cuối"
      >
        Cuối &raquo;
      </button>
    </div>
  );
}

export default Pagination;
