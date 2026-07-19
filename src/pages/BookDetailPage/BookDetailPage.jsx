import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiHeart, FiShare2, FiBookOpen, FiUser, FiInfo, FiLock, FiStar, FiPlus, FiX, FiCheck } from 'react-icons/fi';
import { useBookDetail } from '../../hooks/useBookDetail';
import { useChapters } from '../../hooks/useChapters';
import Pagination from '../../components/Pagination/Pagination';
import { useBookRatings } from '../../hooks/useBookRatings';
import { getFormattedImageUrl } from '../../utils/imageUtils';
import { ROUTES } from '../../config/routes';
import { useAuth } from '../../context/AuthContext';
import bookListService from '../../services/bookListService';
import { getErrorMessage } from '../../services/apiClient';

function BookDetailPage() {
  const { id } = useParams();
  const { book, loading: bookLoading, error: bookError, refetch: refetchBook } = useBookDetail(id);
  const { chapters, loading: chaptersLoading, page: chaptersPage, totalPages: chaptersTotalPages, totalElements: chaptersTotalElements, handlePageChange: handleChaptersPageChange } = useChapters(id, 20);
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('chapters');

  // Book list states
  const [isFollowed, setIsFollowed] = useState(false);
  const [bookLists, setBookLists] = useState([]);
  const [savedListIds, setSavedListIds] = useState([]);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [listError, setListError] = useState('');

  useEffect(() => {
    if (user && id) {
      loadBookLists();
    } else {
      setIsFollowed(false);
      setBookLists([]);
      setSavedListIds([]);
    }
  }, [user, id]);

  const loadBookLists = async () => {
    try {
      const res = await bookListService.getMyBookLists();
      const data = res.result || res || [];
      const lists = (data && data.content && Array.isArray(data.content)) ? data.content : (Array.isArray(data) ? data : []);
      const ids = lists
        .filter(list => Array.isArray(list.bookIds) && list.bookIds.includes(Number(id)))
        .map(list => list.id);

      setBookLists(lists);
      setSavedListIds(ids);
      setIsFollowed(ids.length > 0);
    } catch (err) {
      console.error("Failed to load book lists:", err);
      setListError(getErrorMessage(err));
    }
  };

  const handleToggleFollow = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để theo dõi tác phẩm.");
      return;
    }
    setListModalOpen(true);
    setListError('');
    if (bookLists.length === 0) {
      setBookmarkLoading(true);
      await loadBookLists();
      setBookmarkLoading(false);
    }
  };

  const handleToggleBookInList = async (listId) => {
    setBookmarkLoading(true);
    setListError('');
    try {
      if (savedListIds.includes(listId)) {
        await bookListService.removeBookFromBookList(listId, id);
      } else {
        await bookListService.addBookToBookList(listId, id);
      }
      await loadBookLists();
    } catch (err) {
      console.error("Failed to update book list:", err);
      setListError(getErrorMessage(err));
    } finally {
      setBookmarkLoading(false);
    }
  };

  const handleCreateListAndAddBook = async (e) => {
    e.preventDefault();
    const trimmedName = newListName.trim();
    if (!trimmedName) {
      setListError("Nhập tên danh sách trước khi tạo.");
      return;
    }

    setBookmarkLoading(true);
    setListError('');
    try {
      const createRes = await bookListService.createBookList({ name: trimmedName });
      const createdList = createRes.result || createRes;
      const createdListId = createdList?.id;

      if (!createdListId) {
        throw new Error("Missing created list id");
      }

      await bookListService.addBookToBookList(createdListId, id);
      setNewListName('');
      await loadBookLists();
    } catch (err) {
      console.error("Failed to create book list:", err);
      setListError(getErrorMessage(err));
    } finally {
      setBookmarkLoading(false);
    }
  };

  const {
    ratings,
    ratingsLoading,
    ratingsPage,
    setRatingsPage,
    ratingsTotalPages,
    ratingsTotalElements,
    userRatingScore,
    setUserRatingScore,
    userComment,
    setUserComment,
    editingRatingId,
    submittingRating,
    ratingError,
    handleRatingSubmit,
    handleEditRating,
    handleDeleteRating,
    cancelEdit
  } = useBookRatings(id, user, refetchBook, activeTab);

  const sortedChapters = [...(chapters || [])].sort((a, b) => a.chapterNumber - b.chapterNumber);
  const firstChapter = sortedChapters[0];

  if (bookLoading) {
    return (
      <div className="book-detail-page container">
        <div className="bd-loading">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (bookError || !book) {
    return (
      <div className="book-detail-page container">
        <div className="bd-error">
          <h3>Oops!</h3>
          <p>{bookError || "Không tìm thấy thông tin tác phẩm."}</p>
          <Link to={ROUTES.HOME} className="bd-btn secondary">Về trang chủ</Link>
        </div>
      </div>
    );
  }

  const imageUrl = getFormattedImageUrl(book.coverImage || book.coverImageUrl);
  const statusLabel = book.status === 'PUBLISHED' || book.status === 'AVAILABLE' ? 'Sẵn sàng' : book.status === 'DRAFT' || book.status === 'UNAVAILABLE' ? 'Chưa sẵn sàng' : 'Đang cập nhật';
  const statusClass = book.status === 'PUBLISHED' || book.status === 'AVAILABLE' ? 'status-published' : book.status === 'DRAFT' || book.status === 'UNAVAILABLE' ? 'status-draft' : 'status-ongoing';

  // Check if current user already has a rating in the list
  const hasUserRated = ratings.some(r => r.userId === user?.userId || r.userId === user?.id);

  return (
    <div className="book-detail-page">
      {/* Hero Section */}
      <div className="bd-hero">
        <div className="bd-hero-background" style={{ backgroundImage: `url(${imageUrl || '/default-cover.jpg'})` }}></div>
        <div className="bd-hero-overlay"></div>
        
        <div className="container bd-hero-content">
          <div className="bd-cover-wrapper">
            {imageUrl ? (
              <img src={imageUrl} alt={book.title} className="bd-cover-img" />
            ) : (
              <div className="bd-cover-placeholder">
                <FiBookOpen size={48} />
              </div>
            )}
          </div>
          
          <div className="bd-info">
            <h1 className="bd-title">{book.title || 'Đang cập nhật tiêu đề'}</h1>
            
            <div className="bd-meta">
              <span className="bd-author">
                <FiUser /> {book.author || 'Đang cập nhật'}
              </span>
              <span className={`bd-status ${statusClass}`}>
                {statusLabel}
              </span>
              {book.year && (
                <span className="bd-year">
                  Năm SX: {book.year}
                </span>
              )}
              <span className="bd-rating bd-rating-custom">
                <FiStar 
                  className="bd-rating-star-custom"
                  fill={book.averageRating && Number(book.averageRating) > 0 ? "#ffb300" : "none"} 
                /> 
                {book.averageRating && Number(book.averageRating) > 0 ? `${Number(book.averageRating).toFixed(1)} / 5.0` : 'Chưa có đánh giá'}
              </span>
            </div>

            {book.categories && (Array.isArray(book.categories) ? book.categories : Array.from(book.categories)).length > 0 && (
              <div className="bd-categories-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px', marginBottom: '14px' }}>
                {(Array.isArray(book.categories) ? book.categories : Array.from(book.categories)).map((catName, index) => (
                  <span key={index} className="bd-category-tag" style={{
                    backgroundColor: 'rgba(139, 92, 246, 0.15)',
                    color: 'var(--accent-purple, #8b5cf6)',
                    padding: '4px 12px',
                    borderRadius: '16px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    border: '1px solid rgba(139, 92, 246, 0.3)'
                  }}>
                    {catName}
                  </span>
                ))}
              </div>
            )}

            <div className="bd-actions">
              {firstChapter && (
                <Link 
                  to={ROUTES.CHAPTER_READ.replace(':bookId', id).replace(':chapterId', firstChapter.id)} 
                  className="bd-btn primary bd-read-btn-icon"
                >
                  <FiBookOpen /> Đọc Từ Đầu
                </Link>
              )}
              <button 
                className={`bd-btn icon-btn ${isFollowed ? 'followed' : ''}`} 
                title={isFollowed ? "Quản lý danh sách đã lưu" : "Lưu vào danh sách"}
                onClick={handleToggleFollow}
                disabled={bookmarkLoading}
              >
                <FiHeart fill={isFollowed ? "#ef4444" : "none"} style={{ stroke: isFollowed ? '#ef4444' : 'currentColor' }} />
              </button>
              <button className="bd-btn icon-btn" title="Chia sẻ">
                <FiShare2 />
              </button>
            </div>
          </div>
        </div>
      </div>

      {listModalOpen && (
        <div className="bd-list-modal-overlay" onClick={() => setListModalOpen(false)}>
          <div className="bd-list-modal" onClick={(e) => e.stopPropagation()}>
            <div className="bd-list-modal-header">
              <div>
                <h3>Lưu vào danh sách</h3>
                <p>Chọn danh sách bạn muốn thêm tác phẩm này vào.</p>
              </div>
              <button
                type="button"
                className="bd-list-modal-close"
                onClick={() => setListModalOpen(false)}
                aria-label="Đóng"
              >
                <FiX />
              </button>
            </div>

            {listError && <div className="bd-list-error">{listError}</div>}

            <div className="bd-list-options">
              {bookLists.length > 0 ? (
                bookLists.map((list) => {
                  const isSavedInList = savedListIds.includes(list.id);
                  return (
                    <button
                      key={list.id}
                      type="button"
                      className={`bd-list-option ${isSavedInList ? 'active' : ''}`}
                      onClick={() => handleToggleBookInList(list.id)}
                      disabled={bookmarkLoading}
                    >
                      <span className="bd-list-option-name">{list.name || 'Danh sách không tên'}</span>
                      <span className="bd-list-option-status">
                        {isSavedInList ? <><FiCheck /> Đã thêm</> : <><FiPlus /> Thêm</>}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="bd-list-empty">Bạn chưa có danh sách nào.</div>
              )}
            </div>

            <form className="bd-list-create-form" onSubmit={handleCreateListAndAddBook}>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Tên danh sách mới"
                disabled={bookmarkLoading}
              />
              <button type="submit" disabled={bookmarkLoading}>
                <FiPlus /> Tao va them
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container bd-main">
        <div className="bd-layout">
          {/* Left Column: Details & Tabs */}
          <div className="bd-content-left">
            <div className="bd-synopsis card-panel">
              <h3 className="panel-title"><FiInfo /> Giới Thiệu</h3>
              <div className="synopsis-text">
                {book.description ? (
                  book.description.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))
                ) : (
                  <p className="no-data">Chưa có thông tin giới thiệu cho tác phẩm này.</p>
                )}
              </div>
            </div>

            <div className="bd-tabs-section card-panel">
              <div className="bd-tabs">
                <button 
                  className={`bd-tab ${activeTab === 'chapters' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('chapters'); setRatingsPage(0); }}
                >
                  Danh sách chương ({chaptersTotalElements || 0})
                </button>
                <button 
                  className={`bd-tab ${activeTab === 'ratings' ? 'active' : ''}`}
                  onClick={() => { setActiveTab('ratings'); setRatingsPage(0); }}
                >
                  Đánh giá & Bình luận
                </button>
              </div>

              <div className="bd-tab-content">
                {activeTab === 'chapters' && (
                  <div className="chapters-tab">
                    {chaptersLoading ? (
                      <div className="loading-state">Đang tải danh sách chương...</div>
                    ) : chapters && chapters.length > 0 ? (
                      <>
                        <ul className="chapter-list">
                          {sortedChapters.map((chapter) => (
                            <li key={chapter.id} className="chapter-item">
                              <Link to={ROUTES.CHAPTER_READ.replace(':bookId', id).replace(':chapterId', chapter.id)} className="chapter-link">
                                <span className="chapter-title">{chapter.title}</span>
                                {!chapter.isFree && (
                                  <span className={`chapter-badge premium ${chapter.isLocked ? 'locked' : 'unlocked'}`}>
                                    {chapter.isLocked ? <><FiLock /> Trả phí ({chapter.price} xu)</> : 'Đã mở khóa'}
                                  </span>
                                )}
                                {chapter.isFree && <span className="chapter-badge free">Miễn phí</span>}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        {chaptersTotalPages > 1 && (
                          <Pagination
                            currentPage={chaptersPage + 1}
                            totalPages={chaptersTotalPages}
                            onPageChange={handleChaptersPageChange}
                          />
                        )}
                      </>
                    ) : (
                      <div className="empty-state">
                        Tác phẩm chưa có chương nào được đăng tải.
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'ratings' && (
                  <div className="ratings-tab">
                    {ratingError && <div className="rating-error-banner">{ratingError}</div>}

                    {/* Review submission Form */}
                    {user ? (
                      (!hasUserRated || editingRatingId) ? (
                        <div className="rating-form-container">
                          <h4 className="rating-form-title">
                            {editingRatingId ? "Chỉnh sửa đánh giá của bạn" : "Viết đánh giá của bạn"}
                          </h4>
                          <form onSubmit={handleRatingSubmit}>
                            <div className="rating-stars-select">
                              <span className="bd-rating-select-label">Chọn số sao:</span>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  className={`rating-star-btn ${star <= userRatingScore ? 'active' : ''}`}
                                  onClick={() => setUserRatingScore(star)}
                                >
                                  <FiStar fill={star <= userRatingScore ? "#ffb300" : "none"} />
                                </button>
                              ))}
                            </div>
                            <textarea
                              className="rating-comment-textarea"
                              placeholder="Nhập cảm nhận của bạn về cuốn sách này..."
                              value={userComment}
                              onChange={(e) => setUserComment(e.target.value)}
                              maxLength={500}
                            />
                            <div className="rating-form-actions">
                              <button
                                type="submit"
                                className="bd-btn primary bd-submit-rating-btn"
                                disabled={submittingRating}
                              >
                                {submittingRating ? "Đang gửi..." : (editingRatingId ? "Cập nhật" : "Đăng đánh giá")}
                              </button>
                              {editingRatingId && (
                                <button
                                  type="button"
                                  className="bd-btn secondary bd-cancel-rating-btn"
                                  onClick={cancelEdit}
                                >
                                  Hủy bỏ
                                </button>
                              )}
                            </div>
                          </form>
                        </div>
                      ) : (
                        <div className="rating-form-container bd-rating-rated-msg">
                          Bạn đã đánh giá cuốn sách này. Bạn có thể chỉnh sửa hoặc xóa đánh giá của mình bên dưới.
                        </div>
                      )
                    ) : (
                      <div className="rating-form-container bd-rating-login-msg">
                        Vui lòng <Link to="/login" className="bd-rating-login-link">Đăng nhập</Link> để viết đánh giá cho tác phẩm này.
                      </div>
                    )}

                    {/* Ratings list */}
                    {ratingsLoading ? (
                      <div className="loading-state">Đang tải danh sách đánh giá...</div>
                    ) : ratings && ratings.length > 0 ? (
                      <div className="ratings-list">
                        {ratings.map((rating) => {
                          const isOwnRating = rating.userId === user?.userId || rating.userId === user?.id;
                          return (
                            <div key={rating.id} className="rating-card">
                              <div className="rating-card-header">
                                <div className="rating-card-author">
                                  <span className="rating-author-name">{rating.userName || "Độc giả ẩn danh"}</span>
                                  <div className="rating-stars-display">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <FiStar
                                        key={star}
                                        fill={star <= rating.ratings ? "#ffb300" : "none"}
                                        style={{ stroke: star <= rating.ratings ? '#ffb300' : 'var(--text-muted)' }}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div className="rating-card-meta">
                                  <span className="rating-date">
                                    {rating.createdAt ? new Date(rating.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                  </span>
                                  {(isOwnRating || user?.isAdmin) && (
                                    <div className="rating-actions-btn-group">
                                      {isOwnRating && (
                                        <button
                                          className="rating-action-btn edit"
                                          onClick={() => handleEditRating(rating)}
                                        >
                                          Sửa
                                        </button>
                                      )}
                                      {user?.isAdmin && (
                                        <button
                                          className="rating-action-btn delete"
                                          onClick={() => handleDeleteRating(rating.id)}
                                        >
                                          Xóa
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <p className="rating-comment-body">{rating.comment}</p>
                            </div>
                          );
                        })}

                        {/* Pagination */}
                        {ratingsTotalPages > 1 && (
                          <div className="ratings-pagination">
                            <button
                              className="ratings-pagination-btn"
                              disabled={ratingsPage === 0}
                              onClick={() => setRatingsPage(prev => prev - 1)}
                            >
                              Trang trước
                            </button>
                            <span className="ratings-pagination-info">
                              Trang {ratingsPage + 1} / {ratingsTotalPages}
                            </span>
                            <button
                              className="ratings-pagination-btn"
                              disabled={ratingsPage === ratingsTotalPages - 1}
                              onClick={() => setRatingsPage(prev => prev + 1)}
                            >
                              Trang sau
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="empty-state">
                        Tác phẩm chưa có lượt đánh giá nào. Hãy là người đầu tiên đánh giá!
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="bd-sidebar">
            <div className="card-panel">
              <h3 className="panel-title">Thông tin thêm</h3>
              <ul className="sidebar-info-list">
                <li>
                  <span className="label">Thể loại:</span>
                  <span className="value">
                    {book.categories && book.categories.length > 0
                      ? (Array.isArray(book.categories) ? book.categories : Array.from(book.categories)).join(', ')
                      : 'Đang cập nhật'}
                  </span>
                </li>
                <li>
                  <span className="label">Người đăng:</span>
                  <span className="value">{book.uploaderName || 'N/A'}</span>
                </li>
                <li>
                  <span className="label">Ngày đăng:</span>
                  <span className="value">{book.createdAt ? new Date(book.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                </li>
                <li>
                  <span className="label">Cập nhật:</span>
                  <span className="value">{book.updatedAt ? new Date(book.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
                </li>
                <li>
                  <span className="label">Số chương:</span>
                  <span className="value">{(book.totalChapters !== undefined && book.totalChapters !== null) ? `${book.totalChapters} chương` : 'Đang cập nhật'}</span>
                </li>
                {book.publisher && (
                  <li>
                    <span className="label">NXB:</span>
                    <span className="value">{book.publisher}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetailPage;
