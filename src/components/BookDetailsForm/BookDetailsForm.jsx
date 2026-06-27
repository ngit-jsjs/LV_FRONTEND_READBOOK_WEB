import React from 'react';
import { FiInfo } from 'react-icons/fi';

const BookDetailsForm = ({
  title, setTitle,
  author, setAuthor,
  year, setYear,
  status, setStatus,
  publisher, setPublisher,
  description, setDescription,
  errors,
  allCategories = [],
  categoryIds = []
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
              <option value="UNAVAILABLE">Chưa sẵn sàng (UNAVAILABLE)</option>
              <option value="AVAILABLE">Sẵn sàng (AVAILABLE)</option>
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
{/* bỏ dô style */}
        <div className="form-group">
          <label>Thể loại</label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '12px',
            marginTop: '8px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            maxHeight: '180px',
            overflowY: 'auto'
          }}>
            {allCategories && allCategories.length > 0 ? (
              allCategories.map(cat => {
                const isChecked = Array.isArray(categoryIds) && categoryIds.includes(cat.id);
                return (
                  <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      id={`cat-${cat.id}`}
                      value={cat.id}
                      className="category-checkbox-item"
                      defaultChecked={isChecked}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => e.stopPropagation()}
                      style={{ cursor: 'pointer' }}
                    />
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        const input = document.getElementById(`cat-${cat.id}`);
                        if (input) input.click();
                      }}
                      style={{
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 'normal',
                        margin: 0,
                        userSelect: 'none',
                        color: 'var(--text-primary, #ffffff)'
                      }}
                    >
                      {cat.name}
                    </span>
                  </div>
                );
              })
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Không có thể loại nào</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Mô tả <FiInfo className="label-icon" /></label>
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
