import React, { useState, useEffect, useRef } from 'react';
import { FiInfo, FiSearch, FiX, FiLoader } from 'react-icons/fi';
import authorService from '../../services/authorService';
import publisherService from '../../services/publisherService';
import { getErrorMessage } from '../../services/apiClient';

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
  selectedAuthorId,
  setSelectedAuthorId,
  selectedPublisherId,
  setSelectedPublisherId
}) => {
  const [isAuthorModalOpen, setAuthorModalOpen] = useState(false);
  const [isPublisherModalOpen, setPublisherModalOpen] = useState(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [authorSearchQuery, setAuthorSearchQuery] = useState('');
  const [publisherSearchQuery, setPublisherSearchQuery] = useState('');
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [categoryPage, setCategoryPage] = useState(0);

  // API-based author search state
  const [authorResults, setAuthorResults] = useState([]);
  const [authorPage, setAuthorPage] = useState(0);
  const [authorTotalPages, setAuthorTotalPages] = useState(0);
  const [authorLoading, setAuthorLoading] = useState(false);
  const [authorError, setAuthorError] = useState('');

  // API-based publisher search state
  const [publisherResults, setPublisherResults] = useState([]);
  const [publisherPage, setPublisherPage] = useState(0);
  const [publisherTotalPages, setPublisherTotalPages] = useState(0);
  const [publisherLoading, setPublisherLoading] = useState(false);
  const [publisherError, setPublisherError] = useState('');

  // Debounced API search for authors
  useEffect(() => {
    if (!isAuthorModalOpen) return;

    const timer = setTimeout(async () => {
      setAuthorLoading(true);
      setAuthorError('');
      try {
        let res;
        if (authorSearchQuery.trim()) {
          res = await authorService.searchAuthors(authorSearchQuery.trim(), authorPage, 20);
        } else {
          res = await authorService.getAllAuthors(authorPage, 20);
        }
        const data = res.result || res;
        setAuthorResults(data.content || []);
        setAuthorTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error('Error searching authors:', err);
        setAuthorResults([]);
        setAuthorTotalPages(0);
        setAuthorError(getErrorMessage(err));
      } finally {
        setAuthorLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [authorSearchQuery, authorPage, isAuthorModalOpen]);

  // Debounced API search for publishers
  useEffect(() => {
    if (!isPublisherModalOpen) return;

    const timer = setTimeout(async () => {
      setPublisherLoading(true);
      setPublisherError('');
      try {
        let res;
        if (publisherSearchQuery.trim()) {
          res = await publisherService.searchPublishers(publisherSearchQuery.trim(), publisherPage, 20);
        } else {
          res = await publisherService.getAllPublishers(publisherPage, 20);
        }
        const data = res.result || res;
        setPublisherResults(data.content || []);
        setPublisherTotalPages(data.totalPages || 0);
      } catch (err) {
        console.error('Error searching publishers:', err);
        setPublisherResults([]);
        setPublisherTotalPages(0);
        setPublisherError(getErrorMessage(err));
      } finally {
        setPublisherLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [publisherSearchQuery, publisherPage, isPublisherModalOpen]);

  // Category filtering (still offline since categories are small dataset)
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
            <div className="form-input-flex-group">
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
                className={`form-input form-input-readonly-clickable ${errors.author ? 'error' : ''}`}
              />
              <button
                type="button"
                className="select-popup-btn"
                onClick={() => {
                  setAuthorSearchQuery('');
                  setAuthorPage(0);
                  setAuthorModalOpen(true);
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
            <label>Năm xuất bản <span className="required">*</span></label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className={`form-input ${errors.year ? 'error' : ''}`}
            />
            {errors.year && <span className="error-text">{errors.year}</span>}
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
          <label>Nhà xuất bản <span className="required">*</span></label>
          <div className="form-input-flex-group">
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
              className={`form-input form-input-readonly-clickable ${errors.publisher ? 'error' : ''}`}
            />
            <button
              type="button"
              className="select-popup-btn"
              onClick={() => {
                setPublisherSearchQuery('');
                setPublisherPage(0);
                setPublisherModalOpen(true);
              }}
            >
              <FiSearch /> Tìm NXB
            </button>
          </div>
          {errors.publisher && <span className="error-text">{errors.publisher}</span>}
        </div>

        <div className="form-group">
          <label>Thể loại <span className="required">*</span></label>
          <div className="bdf-tags-container">
            {Array.isArray(categoryIds) && categoryIds.length > 0 ? (
              categoryIds.map(id => {
                const cat = allCategories.find(c => c.id === id);
                if (!cat) return null;
                return (
                  <span key={cat.id} className="bdf-selected-tag">
                    {cat.name}
                    <FiX
                      className="bdf-tag-remove-icon"
                      onClick={() => setCategoryIds(categoryIds.filter(cid => cid !== cat.id))}
                    />
                  </span>
                );
              })
            ) : (
              <span className="bdf-empty-tag-text">Chưa chọn thể loại nào</span>
            )}
          </div>
          <button
            type="button"
            className="select-popup-btn bdf-add-category-btn"
            onClick={() => {
              setCategorySearchQuery('');
              setCategoryPage(0);
              setCategoryModalOpen(true);
            }}
          >
            <FiSearch /> Chọn thể loại
          </button>
          {errors.categoryIds && <span className="error-text bdf-error-block">{errors.categoryIds}</span>}
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

      {/* Author Search Modal - API-based */}
      {isAuthorModalOpen && (
        <div className="author-modal-overlay" onClick={() => setAuthorModalOpen(false)}>
          <div className="auth-card modal-card-small bdf-modal-450" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setAuthorModalOpen(false)}
              className="modal-close-btn"
              title="Đóng"
              type="button"
            >
              <FiX />
            </button>
            
            <h3 className="auth-title modal-title-small bdf-modal-title">
              <FiSearch /> Tìm kiếm tác giả
            </h3>
            <p className="auth-subtitle modal-subtitle-small">Tìm kiếm từ toàn bộ danh sách tác giả</p>

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

            <div className="search-results-list bdf-results-list">
              {authorLoading ? (
                <div className="bdf-loading-spinner-box">
                  <FiLoader className="bdf-loading-spin-icon" /> Đang tìm kiếm...
                </div>
              ) : authorError ? (
                <div className="error-message">
                  Không thể tải danh sách tác giả: {authorError}
                </div>
              ) : authorResults.length > 0 ? (
                authorResults.map(auth => (
                  <div
                    key={auth.id}
                    onClick={() => {
                      setAuthor(auth.name);
                      setSelectedAuthorId(auth.id);
                      setAuthorModalOpen(false);
                    }}
                    className="search-result-item bdf-result-item"
                  >
                    <span className="bdf-result-name">{auth.name}</span>
                    <span className="bdf-result-action">Chọn</span>
                  </div>
                ))
              ) : (
                <div className="bdf-empty-result-msg">
                  {authorSearchQuery.trim() ? `Không tìm thấy tác giả nào khớp với "${authorSearchQuery}"` : 'Không có dữ liệu tác giả'}
                </div>
              )}
            </div>

            {/* Pagination for Authors */}
            {authorTotalPages > 1 && (
              <div className="bdf-modal-pagination">
                <button
                  type="button"
                  disabled={authorPage === 0}
                  onClick={() => setAuthorPage(prev => prev - 1)}
                  className="bdf-modal-page-btn"
                >
                  Trang trước
                </button>
                <span className="bdf-modal-page-info">
                  Trang {authorPage + 1} / {authorTotalPages}
                </span>
                <button
                  type="button"
                  disabled={authorPage === authorTotalPages - 1 || authorTotalPages === 0}
                  onClick={() => setAuthorPage(prev => prev + 1)}
                  className="bdf-modal-page-btn"
                >
                  Trang sau
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Publisher Search Modal - API-based */}
      {isPublisherModalOpen && (
        <div className="author-modal-overlay" onClick={() => setPublisherModalOpen(false)}>
          <div className="auth-card modal-card-small bdf-modal-450" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPublisherModalOpen(false)}
              className="modal-close-btn"
              title="Đóng"
              type="button"
            >
              <FiX />
            </button>
            
            <h3 className="auth-title modal-title-small bdf-modal-title">
              <FiSearch /> Tìm kiếm nhà xuất bản
            </h3>
            <p className="auth-subtitle modal-subtitle-small">Tìm kiếm từ toàn bộ danh sách nhà xuất bản</p>

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

            <div className="search-results-list bdf-results-list">
              {publisherLoading ? (
                <div className="bdf-loading-spinner-box">
                  <FiLoader className="bdf-loading-spin-icon" /> Đang tìm kiếm...
                </div>
              ) : publisherError ? (
                <div className="error-message">
                  Không thể tải danh sách nhà xuất bản: {publisherError}
                </div>
              ) : publisherResults.length > 0 ? (
                publisherResults.map(pub => (
                  <div
                    key={pub.id}
                    onClick={() => {
                      setPublisher(pub.name);
                      setSelectedPublisherId(pub.id);
                      setPublisherModalOpen(false);
                    }}
                    className="search-result-item bdf-result-item"
                  >
                    <span className="bdf-result-name">{pub.name}</span>
                    <span className="bdf-result-action">Chọn</span>
                  </div>
                ))
              ) : (
                <div className="bdf-empty-result-msg">
                  {publisherSearchQuery.trim() ? `Không tìm thấy nhà xuất bản nào khớp với "${publisherSearchQuery}"` : 'Không có dữ liệu nhà xuất bản'}
                </div>
              )}
            </div>

            {/* Pagination for Publishers */}
            {publisherTotalPages > 1 && (
              <div className="bdf-modal-pagination">
                <button
                  type="button"
                  disabled={publisherPage === 0}
                  onClick={() => setPublisherPage(prev => prev - 1)}
                  className="bdf-modal-page-btn"
                >
                  Trang trước
                </button>
                <span className="bdf-modal-page-info">
                  Trang {publisherPage + 1} / {publisherTotalPages}
                </span>
                <button
                  type="button"
                  disabled={publisherPage === publisherTotalPages - 1 || publisherTotalPages === 0}
                  onClick={() => setPublisherPage(prev => prev + 1)}
                  className="bdf-modal-page-btn"
                >
                  Trang sau
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Category Search Modal (offline filtering - small dataset) */}
      {isCategoryModalOpen && (
        <div className="author-modal-overlay" onClick={() => setCategoryModalOpen(false)}>
          <div className="auth-card modal-card-small bdf-modal-500" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setCategoryModalOpen(false)}
              className="modal-close-btn"
              title="Đóng"
              type="button"
            >
              <FiX />
            </button>
            
            <h3 className="auth-title modal-title-small bdf-modal-title">
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

            <div className="search-results-list bdf-category-grid">
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
                      className={`category-search-item bdf-cat-item ${isChecked ? 'active' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Controlled via onClick on the parent div
                        className="bdf-cat-checkbox"
                      />
                      <span className={`bdf-cat-name ${isChecked ? 'bold' : ''}`}>
                        {cat.name}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="bdf-empty-result-msg bdf-grid-span-2">
                  Không tìm thấy thể loại nào khớp với "{categorySearchQuery}"
                </div>
              )}
            </div>

            {/* Pagination for Categories */}
            {categoryTotalPages > 0 && (
              <div className="bdf-modal-pagination">
                <button
                  type="button"
                  disabled={categoryPage === 0}
                  onClick={() => setCategoryPage(prev => prev - 1)}
                  className="bdf-modal-page-btn"
                >
                  Trang trước
                </button>
                <span className="bdf-modal-page-info">
                  Trang {categoryPage + 1} / {categoryTotalPages}
                </span>
                <button
                  type="button"
                  disabled={categoryPage === categoryTotalPages - 1 || categoryTotalPages === 0}
                  onClick={() => setCategoryPage(prev => prev + 1)}
                  className="bdf-modal-page-btn"
                >
                  Trang sau
                </button>
              </div>
            )}

            <button
              type="button"
              className="auth-submit-btn modal-submit-btn bdf-full-btn"
              onClick={() => setCategoryModalOpen(false)}
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
