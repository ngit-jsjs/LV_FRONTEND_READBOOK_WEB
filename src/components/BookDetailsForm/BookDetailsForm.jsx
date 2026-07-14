import React, { useState } from 'react';
import { FiInfo, FiSearch, FiX } from 'react-icons/fi';

const BookDetailsForm = ({
  title, setTitle,
  author, setAuthor,
  year, setYear,
  status, setStatus,
  publisher, setPublisher,
  description, setDescription,
  errors,
  allCategories = [],
  categoryIds = [],
  setCategoryIds,
  allAuthors = [],
  allPublishers = []
}) => {
  const [isAuthorModalOpen, setAuthorModalOpen] = useState(false);
  const [isPublisherModalOpen, setPublisherModalOpen] = useState(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [authorSearchQuery, setAuthorSearchQuery] = useState('');
  const [publisherSearchQuery, setPublisherSearchQuery] = useState('');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [authorPage, setAuthorPage] = useState(0);
  const [publisherPage, setPublisherPage] = useState(0);
  const [categoryPage, setCategoryPage] = useState(0);

  const filteredAuthors = allAuthors.filter(auth =>
    auth.name && auth.name.toLowerCase().includes(authorSearchQuery.toLowerCase())
  );
  const authorTotalPages = Math.ceil(filteredAuthors.length / 20);
  const displayedAuthors = filteredAuthors.slice(authorPage * 20, (authorPage + 1) * 20);

  const filteredPublishers = allPublishers.filter(pub =>
    pub.name && pub.name.toLowerCase().includes(publisherSearchQuery.toLowerCase())
  );
  const publisherTotalPages = Math.ceil(filteredPublishers.length / 20);
  const displayedPublishers = filteredPublishers.slice(publisherPage * 20, (publisherPage + 1) * 20);

  const filteredCategories = allCategories.filter(cat =>
    cat.name && cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );
  const categoryTotalPages = Math.ceil(filteredCategories.length / 20);
  const displayedCategories = filteredCategories.slice(categoryPage * 20, (categoryPage + 1) * 20);

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
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Chọn tác giả"
                value={author}
                readOnly
                onClick={() => {
                  setAuthorSearchQuery('');
                  setAuthorPage(0);
                  setAuthorModalOpen(true);
                }}
                className={`form-input ${errors.author ? 'error' : ''}`}
                style={{ flex: 1, cursor: 'pointer' }}
              />
              <button
                type="button"
                className="select-popup-btn"
                onClick={() => {
                  setAuthorSearchQuery('');
                  setAuthorPage(0);
                  setAuthorModalOpen(true);
                }}
                style={{
                  padding: '0 16px',
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  color: 'var(--accent-purple, #a855f7)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}
              >
                <FiSearch /> Tìm tác giả
              </button>
            </div>
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
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Chọn nhà xuất bản"
              value={publisher}
              readOnly
              onClick={() => {
                setPublisherSearchQuery('');
                setPublisherPage(0);
                setPublisherModalOpen(true);
              }}
              className="form-input"
              style={{ flex: 1, cursor: 'pointer' }}
            />
            <button
              type="button"
              className="select-popup-btn"
              onClick={() => {
                setPublisherSearchQuery('');
                setPublisherPage(0);
                setPublisherModalOpen(true);
              }}
              style={{
                padding: '0 16px',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                color: 'var(--accent-purple, #a855f7)',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}
            >
              <FiSearch /> Tìm NXB
            </button>
          </div>
        </div>
{/* bỏ dô style */}
        <div className="form-group">
          <label>Thể loại</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            {Array.isArray(categoryIds) && categoryIds.length > 0 ? (
              categoryIds.map(id => {
                const cat = allCategories.find(c => c.id === id);
                if (!cat) return null;
                return (
                  <span
                    key={cat.id}
                    style={{
                      background: 'rgba(139, 92, 246, 0.15)',
                      border: '1px solid rgba(139, 92, 246, 0.4)',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: '500'
                    }}
                  >
                    {cat.name}
                    <FiX
                      style={{ cursor: 'pointer', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}
                      onClick={() => setCategoryIds(categoryIds.filter(cid => cid !== cat.id))}
                    />
                  </span>
                );
              })
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chưa chọn thể loại nào</span>
            )}
          </div>
          <button
            type="button"
            className="select-popup-btn"
            onClick={() => {
              setCategorySearchQuery('');
              setCategoryPage(0);
              setCategoryModalOpen(true);
            }}
            style={{
              padding: '8px 16px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: 'var(--accent-purple, #a855f7)',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              width: 'fit-content',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}
          >
            <FiSearch /> Chọn thể loại
          </button>
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

      {/* Author Search Modal */}
      {isAuthorModalOpen && (
        <div className="author-modal-overlay" onClick={() => setAuthorModalOpen(false)}>
          <div className="auth-card modal-card-small" style={{ width: '450px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setAuthorModalOpen(false)}
              className="modal-close-btn"
              title="Đóng"
              type="button"
            >
              <FiX />
            </button>
            
            <h3 className="auth-title modal-title-small" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiSearch /> Tìm kiếm tác giả
            </h3>
            <p className="auth-subtitle modal-subtitle-small">Chọn từ danh sách tác giả có sẵn</p>

            <div className="auth-form-group modal-form-group">
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  className="auth-input modal-input-inner"
                  value={authorSearchQuery}
                  onChange={(e) => {
                    setAuthorSearchQuery(e.target.value);
                    setAuthorPage(0);
                  }}
                  placeholder="Nhập tên tác giả cần tìm..."
                  autoFocus
                />
              </div>
            </div>

            <div className="search-results-list" style={{
              maxHeight: '240px',
              overflowY: 'auto',
              marginTop: '16px',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.2)',
              padding: '4px'
            }}>
              {displayedAuthors.length > 0 ? (
                displayedAuthors.map(auth => (
                  <div
                    key={auth.id}
                    onClick={() => {
                      setAuthor(auth.name);
                      setAuthorModalOpen(false);
                    }}
                    style={{
                      padding: '10px 16px',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderRadius: '4px'
                    }}
                    className="search-result-item"
                  >
                    <span style={{ color: '#fff', fontWeight: '500' }}>{auth.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-purple)' }}>Chọn</span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Không tìm thấy tác giả nào khớp với "{authorSearchQuery}"
                </div>
              )}
            </div>

            {/* Pagination for Authors */}
            {authorTotalPages > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                <button
                  type="button"
                  disabled={authorPage === 0}
                  onClick={() => setAuthorPage(prev => prev - 1)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Trang trước
                </button>
                <span style={{ color: 'var(--text-muted, #6b6f80)', fontSize: '0.85rem' }}>
                  Trang {authorPage + 1} / {authorTotalPages}
                </span>
                <button
                  type="button"
                  disabled={authorPage === authorTotalPages - 1 || authorTotalPages === 0}
                  onClick={() => setAuthorPage(prev => prev + 1)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Trang sau
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Publisher Search Modal */}
      {isPublisherModalOpen && (
        <div className="author-modal-overlay" onClick={() => setPublisherModalOpen(false)}>
          <div className="auth-card modal-card-small" style={{ width: '450px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPublisherModalOpen(false)}
              className="modal-close-btn"
              title="Đóng"
              type="button"
            >
              <FiX />
            </button>
            
            <h3 className="auth-title modal-title-small" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiSearch /> Tìm kiếm nhà xuất bản
            </h3>
            <p className="auth-subtitle modal-subtitle-small">Chọn từ danh sách nhà xuất bản có sẵn</p>

            <div className="auth-form-group modal-form-group">
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  className="auth-input modal-input-inner"
                  value={publisherSearchQuery}
                  onChange={(e) => {
                    setPublisherSearchQuery(e.target.value);
                    setPublisherPage(0);
                  }}
                  placeholder="Nhập tên nhà xuất bản cần tìm..."
                  autoFocus
                />
              </div>
            </div>

            <div className="search-results-list" style={{
              maxHeight: '240px',
              overflowY: 'auto',
              marginTop: '16px',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.2)',
              padding: '4px'
            }}>
              {displayedPublishers.length > 0 ? (
                displayedPublishers.map(pub => (
                  <div
                    key={pub.id}
                    onClick={() => {
                      setPublisher(pub.name);
                      setPublisherModalOpen(false);
                    }}
                    style={{
                      padding: '10px 16px',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderRadius: '4px'
                    }}
                    className="search-result-item"
                  >
                    <span style={{ color: '#fff', fontWeight: '500' }}>{pub.name}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-purple)' }}>Chọn</span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Không tìm thấy nhà xuất bản nào khớp với "{publisherSearchQuery}"
                </div>
              )}
            </div>

            {/* Pagination for Publishers */}
            {publisherTotalPages > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                <button
                  type="button"
                  disabled={publisherPage === 0}
                  onClick={() => setPublisherPage(prev => prev - 1)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Trang trước
                </button>
                <span style={{ color: 'var(--text-muted, #6b6f80)', fontSize: '0.85rem' }}>
                  Trang {publisherPage + 1} / {publisherTotalPages}
                </span>
                <button
                  type="button"
                  disabled={publisherPage === publisherTotalPages - 1 || publisherTotalPages === 0}
                  onClick={() => setPublisherPage(prev => prev + 1)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Trang sau
                </button>
              </div>
            )}

          </div>
        </div>
      )}
      {/* Category Search Modal */}
      {isCategoryModalOpen && (
        <div className="author-modal-overlay" onClick={() => setCategoryModalOpen(false)}>
          <div className="auth-card modal-card-small" style={{ width: '500px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setCategoryModalOpen(false)}
              className="modal-close-btn"
              title="Đóng"
              type="button"
            >
              <FiX />
            </button>
            
            <h3 className="auth-title modal-title-small" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiSearch /> Tìm kiếm & Chọn thể loại
            </h3>
            <p className="auth-subtitle modal-subtitle-small">Chọn các thể loại phù hợp cho tác phẩm của bạn</p>

            <div className="auth-form-group modal-form-group">
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  className="auth-input modal-input-inner"
                  value={categorySearchQuery}
                  onChange={(e) => {
                    setCategorySearchQuery(e.target.value);
                    setCategoryPage(0);
                  }}
                  placeholder="Nhập tên thể loại cần tìm..."
                  autoFocus
                />
              </div>
            </div>

            <div className="search-results-list" style={{
              maxHeight: '280px',
              overflowY: 'auto',
              marginTop: '16px',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.2)',
              padding: '8px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px'
            }}>
              {displayedCategories.length > 0 ? (
                displayedCategories.map(cat => {
                  const isChecked = Array.isArray(categoryIds) && categoryIds.includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        if (isChecked) {
                          setCategoryIds(categoryIds.filter(id => id !== cat.id));
                        } else {
                          setCategoryIds([...categoryIds, cat.id]);
                        }
                      }}
                      style={{
                        padding: '10px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: isChecked ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                        border: isChecked ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
                        borderRadius: '6px',
                        transition: 'all 0.2s',
                        userSelect: 'none'
                      }}
                      className="category-search-item"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Controlled via onClick on the parent div
                        style={{ cursor: 'pointer' }}
                      />
                      <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: isChecked ? '600' : 'normal' }}>
                        {cat.name}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div style={{ gridColumn: 'span 2', padding: '16px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Không tìm thấy thể loại nào khớp với "{categorySearchQuery}"
                </div>
              )}
            </div>

            {/* Pagination for Categories */}
            {categoryTotalPages > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
                <button
                  type="button"
                  disabled={categoryPage === 0}
                  onClick={() => setCategoryPage(prev => prev - 1)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Trang trước
                </button>
                <span style={{ color: 'var(--text-muted, #6b6f80)', fontSize: '0.85rem' }}>
                  Trang {categoryPage + 1} / {categoryTotalPages}
                </span>
                <button
                  type="button"
                  disabled={categoryPage === categoryTotalPages - 1 || categoryTotalPages === 0}
                  onClick={() => setCategoryPage(prev => prev + 1)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Trang sau
                </button>
              </div>
            )}

            <button
              type="button"
              className="auth-submit-btn modal-submit-btn"
              onClick={() => setCategoryModalOpen(false)}
              style={{ width: '100%', marginTop: '20px', padding: '12px' }}
            >
              Xác nhận ({categoryIds.length} đã chọn)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetailsForm;
