import React from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiFileText, FiEye } from 'react-icons/fi';


function ActionButtons({
  onView,
  viewLink,
  onEdit,
  onDelete,
  showText = false,
  viewTitle = 'Xem chi tiết',
  editTitle = 'Sửa',
  deleteTitle = 'Xóa',
  viewIcon = null
}) {
  const btnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    width: showText ? 'auto' : undefined,
    height: showText ? 'auto' : undefined,
    textDecoration: 'none'
  };

  const renderViewIcon = viewIcon || <FiEye />;

  return (
    <div className="action-buttons-group" style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
      {viewLink ? (
        <Link
          to={viewLink}
          target="_blank"
          rel="noopener noreferrer"
          className="um-action-btn action-btn detail-btn"
          title={viewTitle}
          style={btnStyle}
        >
          {showText ? viewTitle : renderViewIcon}
        </Link>
      ) : onView ? (
        <button
          className="um-action-btn action-btn detail-btn"
          onClick={onView}
          title={viewTitle}
          style={btnStyle}
        >
          {showText ? viewTitle : renderViewIcon}
        </button>
      ) : null}

      {onEdit && (
        <button
          className="um-action-btn action-btn edit-btn"
          onClick={onEdit}
          title={editTitle}
          style={btnStyle}
        >
          {showText ? editTitle : <FiEdit2 />}
        </button>
      )}

      {onDelete && (
        <button
          className="um-action-btn action-btn delete-btn"
          onClick={onDelete}
          title={deleteTitle}
          style={btnStyle}
        >
          {showText ? deleteTitle : <FiTrash2 />}
        </button>
      )}
    </div>
  );
}

export default ActionButtons;
