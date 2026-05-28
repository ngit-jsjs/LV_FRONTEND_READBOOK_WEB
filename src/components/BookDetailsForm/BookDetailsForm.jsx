import React from 'react';
import { FiInfo } from 'react-icons/fi';

const BookDetailsForm = ({
  title, setTitle,
  author, setAuthor,
  year, setYear,
  status, setStatus,
  publisher, setPublisher,
  description, setDescription,
  errors
}) => {
  return (
    <div className="create-book-right">
      <div className="form-tabs">
        <div className="form-tab active">Chi Tiết Truyện</div>
      </div>

      <div className="form-body">
        <div className="form-row">
          <div className="form-group">
            <label>Tiêu đề <span className="required">*</span></label>
            <input
              type="text"
              placeholder="Truyện Chưa Có Tiêu Đề"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`form-input ${errors.title ? 'error' : ''}`}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label>Tác giả <span className="required">*</span></label>
            <input
              type="text"
              placeholder="Tên tác giả"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className={`form-input ${errors.author ? 'error' : ''}`}
            />
            {errors.author && <span className="error-text">{errors.author}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Năm xuất bản</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Trạng thái <span className="required">*</span></label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`form-input ${errors.status ? 'error' : ''}`}
            >
              <option value="DRAFT">Bản nháp (DRAFT)</option>
              <option value="PUBLISHED">Đã xuất bản (PUBLISHED)</option>
            </select>
            {errors.status && <span className="error-text">{errors.status}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Nhà xuất bản (Tùy chọn)</label>
          <input
            type="text"
            placeholder="Ví dụ: Bloomsbury"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Mô tả <span className="required">*</span> <FiInfo className="label-icon" /></label>
          <textarea
            placeholder="Nhập mô tả truyện của bạn..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            rows="5"
          ></textarea>
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>
      </div>
    </div>
  );
};

export default BookDetailsForm;
