import React from 'react';
import { FiEdit2, FiTrash2, FiFileText } from 'react-icons/fi';


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
