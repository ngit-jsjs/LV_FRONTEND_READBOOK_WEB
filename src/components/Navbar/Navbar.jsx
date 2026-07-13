import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { MdMenuBook } from 'react-icons/md';
import { FaCrown, FaCoins } from 'react-icons/fa';
import { FiUser, FiLogOut, FiSearch, FiFilter, FiRefreshCw, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/routes';
import categoryService from '../../services/categoryService';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Search local states
  const [localKeyword, setLocalKeyword] = useState('');
  const [localAuthor, setLocalAuthor] = useState('');
  const [localPublisher, setLocalPublisher] = useState('');
  const [localYear, setLocalYear] = useState('');
  const [localCategoryIds, setLocalCategoryIds] = useState([]);

  const [showFilters, setShowFilters] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [modalPage, setModalPage] = useState(0);

  // Fetch categories once for the filter panel
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategoriesList();
        const cats = res.result || res || [];
        setCategoriesList(cats);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categoriesList.filter(cat =>
    cat.name && cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );
  const modalTotalPages = Math.ceil(filteredCategories.length / 20);
  const displayedCategories = filteredCategories.slice(modalPage * 20, (modalPage + 1) * 20);

  // Sync state with URL search params when they change
  useEffect(() => {
    setLocalKeyword(searchParams.get('keyword') || '');
    setLocalAuthor(searchParams.get('author') || '');
    setLocalPublisher(searchParams.get('publisher') || '');
    setLocalYear(searchParams.get('year') || '');
    setLocalCategoryIds(
      searchParams.get('categories')
        ? searchParams.get('categories').split(',').map(Number)
        : []
    );
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (localKeyword) params.set('keyword', localKeyword);
    if (localAuthor) params.set('author', localAuthor);
    if (localPublisher) params.set('publisher', localPublisher);
    if (localYear) params.set('year', localYear);
    if (localCategoryIds.length > 0) params.set('categories', localCategoryIds.join(','));

    navigate(`/search?${params.toString()}`);
    setShowFilters(false);
  };

  const handleClearAll = () => {
    setLocalKeyword('');
    setLocalAuthor('');
    setLocalPublisher('');
    setLocalYear('');
    setLocalCategoryIds([]);
    navigate('/search');
  };

  const toggleCategory = (categoryId) => {
    if (localCategoryIds.includes(categoryId)) {
      setLocalCategoryIds(localCategoryIds.filter(id => id !== categoryId));
    } else {
      setLocalCategoryIds([...localCategoryIds, categoryId]);
    }
  };

  return (
    <>
      <header className="header-wrapper">
        <nav className="navbar">
          <div className="container navbar-inner">

            <Link to={ROUTES.HOME} className="navbar-logo">
              <MdMenuBook className="navbar-logo-icon" />
              ReadVerse
            </Link>

            <div className="navbar-right">
              {user ? (
                <div className="navbar-user-actions">
                  <div className="navbar-coin-badge-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="navbar-coin-badge" title="Số xu của bạn">
                      <FaCoins className="coin-icon" />
                      <span>{user.amount || 0}</span>
                    </div>
                    <Link
                      to={ROUTES.PREMIUM}
                      className="navbar-recharge-btn"
                      style={{
                        padding: '4px 10px',
                        background: 'rgba(234, 179, 8, 0.1)',
                        border: '1px solid rgba(234, 179, 8, 0.3)',
                        borderRadius: '20px',
                        color: '#eab308',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(234, 179, 8, 0.2)';
                        e.currentTarget.style.borderColor = '#eab308';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(234, 179, 8, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(234, 179, 8, 0.3)';
                      }}
                    >
                      Nạp xu
                    </Link>
                  </div>
                  <Link to={ROUTES.PROFILE} className="navbar-user-profile">
                    <FiUser style={{ fontSize: '1.2rem' }} />
                    <span className="navbar-username">{user.name}</span>
                  </Link>
                  <button
                    onClick={async () => {
                      await logout();
                      navigate(ROUTES.HOME);
                    }}
                    className="navbar-logout-btn"
                    title="Đăng xuất"
                  >
                    <FiLogOut />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              ) : (
                <Link to={ROUTES.LOGIN} className="navbar-login-btn">
                  <FiUser /> Đăng nhập
                </Link>
              )}
            </div>

          </div>
        </nav>

        {/* Sub-navbar */}
        <nav className="sub-navbar">
          <div className="container sub-navbar-inner" style={{ position: 'relative' }}>
            <div className="sub-navbar-links">
              <Link to={ROUTES.HOME} className={`sub-navbar-link ${location.pathname === ROUTES.HOME || location.pathname === '/search' ? 'active' : ''}`}>Trang chủ</Link>
              <Link to={ROUTES.FOLLOWED_BOOKS} className={`sub-navbar-link ${location.pathname === ROUTES.FOLLOWED_BOOKS ? 'active' : ''}`}>Tủ sách</Link>
              <Link to={ROUTES.RECENTLY_READ} className={`sub-navbar-link ${location.pathname === ROUTES.RECENTLY_READ ? 'active' : ''}`}>Đọc gần đây</Link>
              <Link to={ROUTES.REVIEWED_BOOKS} className={`sub-navbar-link ${location.pathname === ROUTES.REVIEWED_BOOKS || location.pathname === ROUTES.UNRATED_BOOKS ? 'active' : ''}`}>Đánh giá</Link>
              <Link to={ROUTES.TRANSACTION_HISTORY} className={`sub-navbar-link ${location.pathname === ROUTES.TRANSACTION_HISTORY ? 'active' : ''}`}>Giao dịch</Link>
              {user?.roles?.includes('ADMIN') && (
                <Link to={ROUTES.ADMIN_DASHBOARD} className={`sub-navbar-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}>Admin</Link>
              )}
            </div>

            {/* Search and Filters */}
            <div className="sub-navbar-search-wrapper">
              <form className="sub-navbar-search-form" onSubmit={handleSearchSubmit}>
                <FiSearch style={{ color: 'var(--accent-purple, #8b5cf6)', fontSize: '1.1rem' }} />
                <input
                  type="text"
                  className="sub-navbar-search-input"
                  placeholder="Tìm tên tác phẩm, tác giả..."
                  value={localKeyword}
                  onChange={(e) => setLocalKeyword(e.target.value)}
                />
                {localKeyword && (
                  <button
                    type="button"
                    className="sub-navbar-search-clear"
                    onClick={handleClearAll}
                    title="Xóa tìm kiếm"
                  >
                    &times;
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`sub-navbar-filter-btn ${showFilters ? 'active' : ''}`}
                >
                  <FiFilter /> Bộ lọc {showFilters ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </form>

              {/* Filter Panel Dropdown */}
              {showFilters && (
                <div className="sub-navbar-filter-panel">
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                    Bộ lọc tìm kiếm nâng cao
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                    {/* Author filter */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-muted, #6b6f80)', fontWeight: '600' }}>Tác giả</label>
                      <input
                        type="text"
                        placeholder="Tên tác giả..."
                        value={localAuthor}
                        onChange={(e) => setLocalAuthor(e.target.value)}
                        style={{ background: 'var(--bg-primary, #272d4a)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '8px', padding: '8px 12px', outline: 'none', fontSize: '0.9rem' }}
                      />
                    </div>

                    {/* Publisher filter */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-muted, #6b6f80)', fontWeight: '600' }}>Nhà xuất bản</label>
                      <input
                        type="text"
                        placeholder="Tên nhà xuất bản..."
                        value={localPublisher}
                        onChange={(e) => setLocalPublisher(e.target.value)}
                        style={{ background: 'var(--bg-primary, #272d4a)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '8px', padding: '8px 12px', outline: 'none', fontSize: '0.9rem' }}
                      />
                    </div>

                    {/* Year filter */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '0.85rem', color: 'var(--text-muted, #6b6f80)', fontWeight: '600' }}>Năm xuất bản</label>
                      <input
                        type="number"
                        placeholder="Ví dụ: 2024"
                        value={localYear}
                        onChange={(e) => setLocalYear(e.target.value)}
                        style={{ background: 'var(--bg-primary, #272d4a)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '8px', padding: '8px 12px', outline: 'none', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  {/* Category chip filter */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted, #6b6f80)', fontWeight: '600', marginBottom: '8px' }}>Thể loại</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                      {localCategoryIds.length > 0 ? (
                        localCategoryIds.map(id => {
                          const cat = categoriesList.find(c => c.id === id);
                          if (!cat) return null;
                          return (
                            <span
                              key={cat.id}
                              style={{
                                background: 'rgba(139, 92, 246, 0.15)',
                                border: '1px solid rgba(139, 92, 246, 0.4)',
                                color: '#fff',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontWeight: '500'
                              }}
                            >
                              {cat.name}
                              <button
                                type="button"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  cursor: 'pointer',
                                  padding: 0,
                                  fontSize: '0.9rem',
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                                onClick={() => setLocalCategoryIds(localCategoryIds.filter(cid => cid !== cat.id))}
                              >
                                &times;
                              </button>
                            </span>
                          );
                        })
                      ) : (
                        <span style={{ color: 'var(--text-muted, #6b6f80)', fontSize: '0.9rem' }}>Chưa chọn thể loại nào</span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="select-popup-btn"
                      onClick={() => {
                        setCategorySearchQuery('');
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

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                        padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem',
                        fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
                        border: 'none'
                      }}
                    >
                      <FiRefreshCw /> Đặt lại
                    </button>
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: 'var(--accent-purple, #8b5cf6)', color: '#fff',
                        padding: '8px 20px', borderRadius: '8px', fontSize: '0.85rem',
                        fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s',
                        border: 'none'
                      }}
                    >
                      Tìm kiếm
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </nav>
      </header>

      {/* Category Search Modal inside Navbar */}
      {isCategoryModalOpen && (
        <div className="author-modal-overlay" onClick={() => setCategoryModalOpen(false)} style={{ zIndex: 1100 }}>
          <div className="auth-card modal-card-small" style={{ width: '500px', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setCategoryModalOpen(false)}
              className="modal-close-btn"
              title="Đóng"
              type="button"
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted, #6b6f80)',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
            
            <h3 className="auth-title modal-title-small" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 8px 0', color: '#fff' }}>
              <FiSearch /> Tìm kiếm & Chọn thể loại
            </h3>
            <p className="auth-subtitle modal-subtitle-small" style={{ color: 'var(--text-muted, #6b6f80)', fontSize: '0.85rem', margin: '0 0 16px 0' }}>
              Chọn các thể loại để lọc sách
            </p>

            <div className="auth-form-group modal-form-group" style={{ marginBottom: '16px' }}>
              <input
                type="text"
                className="admin-input"
                value={categorySearchQuery}
                onChange={(e) => {
                  setCategorySearchQuery(e.target.value);
                  setModalPage(0);
                }}
                placeholder="Nhập tên thể loại cần tìm..."
                autoFocus
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-color, rgba(255, 255, 255, 0.1))',
                  borderRadius: '8px',
                  color: '#fff',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div className="search-results-list" style={{
              maxHeight: '280px',
              overflowY: 'auto',
              marginTop: '16px',
              border: '1px solid var(--border-color, rgba(255,255,255,0.08))',
              borderRadius: '8px',
              background: 'rgba(0, 0, 0, 0.2)',
              padding: '8px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px'
            }}>
              {displayedCategories.length > 0 ? (
                displayedCategories.map(cat => {
                  const isChecked = localCategoryIds.includes(cat.id);
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        if (isChecked) {
                          setLocalCategoryIds(localCategoryIds.filter(id => id !== cat.id));
                        } else {
                          setLocalCategoryIds([...localCategoryIds, cat.id]);
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
                        onChange={() => {}} // Controlled via onClick on parent
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

            {/* Pagination for Categories inside Modal */}
            {modalTotalPages > 0 && (
              <div className="followed-books-pagination" style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                <button
                  type="button"
                  className="followed-books-pagination-btn"
                  disabled={modalPage === 0}
                  onClick={() => setModalPage(prev => prev - 1)}
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
                <span className="followed-books-pagination-info" style={{ color: 'var(--text-muted, #6b6f80)', fontSize: '0.85rem' }}>
                  Trang {modalPage + 1} / {modalTotalPages}
                </span>
                <button
                  type="button"
                  className="followed-books-pagination-btn"
                  disabled={modalPage === modalTotalPages - 1 || modalTotalPages === 0}
                  onClick={() => setModalPage(prev => prev + 1)}
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
              className="admin-submit-btn"
              onClick={() => setCategoryModalOpen(false)}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '12px',
                background: 'var(--accent-purple, #8b5cf6)',
                border: 'none',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Xác nhận ({localCategoryIds.length} đã chọn)
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
