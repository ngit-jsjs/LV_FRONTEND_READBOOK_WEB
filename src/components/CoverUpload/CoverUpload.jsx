import React from 'react';
import { FiImage, FiInfo } from 'react-icons/fi';

const CoverUpload = ({ coverImage, handleImageUpload }) => {
  return (
    <div className="create-book-left">
      <label htmlFor="cover-upload" className="cover-upload-box">
        {coverImage ? (
          <img src={coverImage} alt="Cover Preview" className="cover-preview" />
        ) : (
          <div className="cover-upload-placeholder">
            <FiImage className="placeholder-icon" />
            <span>Thêm trang bìa</span>
          </div>
        )}
        <input
          type="file"
          id="cover-upload"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <button className="cover-info-btn" onClick={(e) => e.preventDefault()}>
          <FiInfo />
        </button>
      </label>
    </div>
  );
};

export default CoverUpload;
