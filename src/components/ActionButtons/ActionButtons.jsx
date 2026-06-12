import React from 'react';
import { FiEdit2, FiTrash2, FiFileText } from 'react-icons/fi';

/**
 * Component hiển thị nhóm nút Hành động (Chi tiết, Sửa, Xóa) có thể tái sử dụng.
 * 
 * @param {Function} onView - Callback khi nhấn Chi tiết. Nếu không truyền, nút Chi tiết sẽ ẩn.
 * @param {Function} onEdit - Callback khi nhấn Sửa. Nếu không truyền, nút Sửa sẽ ẩn.
 * @param {Function} onDelete - Callback khi nhấn Xóa. Nếu không truyền, nút Xóa sẽ ẩn.
 * @param {boolean} showText - Hiển thị nhãn text bên cạnh icon (mặc định: false).
 * @param {string} viewTitle - Tooltip nút Chi tiết.
 * @param {string} editTitle - Tooltip nút Sửa.
 * @param {string} deleteTitle - Tooltip nút Xóa.
 */
function ActionButtons({
  onView,
  onEdit,
  onDelete,
  showText = false,
  viewTitle = 'Chi tiết',
  editTitle = 'Sửa',
  deleteTitle = 'Xóa'
}) {
  const btnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    width: showText ? 'auto' : undefined,
    height: showText ? 'auto' : undefined
  };

  return (
    <div className="action-buttons-group" style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
      {onView && (
        <button
          className="um-action-btn action-btn detail-btn"
          onClick={onView}
          title={viewTitle}
          style={btnStyle}
        >
          <FiFileText /> {showText && 'Chi tiết'}
        </button>
      )}

      {onEdit && (
        <button
          className="um-action-btn action-btn edit-btn"
          onClick={onEdit}
          title={editTitle}
          style={btnStyle}
        >
          <FiEdit2 /> {showText && 'Sửa'}
        </button>
      )}

      {onDelete && (
        <button
          className="um-action-btn action-btn delete-btn"
          onClick={onDelete}
          title={deleteTitle}
          style={btnStyle}
        >
          <FiTrash2 /> {showText && 'Xóa'}
        </button>
      )}
    </div>
  );
}

export default ActionButtons;
