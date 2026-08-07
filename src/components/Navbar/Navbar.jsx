import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { MdMenuBook } from 'react-icons/md';
import { FaCrown, FaCoins } from 'react-icons/fa';
import { FiUser, FiUserPlus, FiLogOut, FiSearch, FiFilter, FiRefreshCw, FiChevronDown, FiChevronUp } from 'react-icons/fi';
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
                  <div className="navbar-coin-badge-container">
                    <div className="navbar-coin-badge" title="Số xu của bạn">
                      <FaCoins className="coin-icon" />
                      <span>{user.amount || 0}</span>
                    </div>
                    <Link
                      to={ROUTES.PREMIUM}
                      className="navbar-recharge-btn"
                    >
                      Nạp xu
                    </Link>
                  </div>
                  <Link to={ROUTES.PROFILE} className="navbar-user-profile">
                    <FiUser className="navbar-user-icon" />
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
                <div className="navbar-auth-group">
                  <Link to={ROUTES.LOGIN} className="navbar-login-btn">
                    <FiUser /> Đăng nhập
                  </Link>
                  <span className="navbar-auth-divider">|</span>
                  <Link to={ROUTES.REGISTER} className="navbar-login-btn">
                    <FiUserPlus /> Đăng ký
                  </Link>
                </div>
              )}
            </div>

          </div>
        </nav>

        {/* Sub-navbar */}
        <nav className="sub-navbar">
          <div className="container sub-navbar-inner">
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
                <FiSearch className="sub-navbar-search-icon" />
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
                  <h3 className="filter-panel-title">
                    Bộ lọc tìm kiếm nâng cao
                  </h3>

                  <div className="filter-panel-grid">
                    {/* Author filter */}
                    <div className="filter-panel-field">
                      <label className="filter-panel-label">Tác giả</label>
                      <input
                        type="text"
                        placeholder="Tên tác giả..."
                        value={localAuthor}
                        onChange={(e) => setLocalAuthor(e.target.value)}
                        className="filter-panel-input"
                      />
                    </div>

                    {/* Publisher filter */}
                    <div className="filter-panel-field">
                      <label className="filter-panel-label">Nhà xuất bản</label>
                      <input
                        type="text"
                        placeholder="Tên nhà xuất bản..."
                        value={localPublisher}
                        onChange={(e) => setLocalPublisher(e.target.value)}
                        className="filter-panel-input"
                      />
                    </div>

                    {/* Year filter */}
                    <div className="filter-panel-field">
                      <label className="filter-panel-label">Năm xuất bản</label>
                      <input
                        type="number"
                        placeholder="Ví dụ: 2024"
                        value={localYear}
                        onChange={(e) => setLocalYear(e.target.value)}
                        className="filter-panel-input"
                      />
                    </div>
                  </div>

                  {/* Category chip filter */}
                  <div className="filter-panel-category-section">
                    <label className="filter-panel-label bdf-error-block">Thể loại</label>
                    <div className="bdf-tags-container">
                      {localCategoryIds.length > 0 ? (
                        localCategoryIds.map(id => {
                          const cat = categoriesList.find(c => c.id === id);
                          if (!cat) return null;
                          return (
                            <span key={cat.id} className="filter-category-chip">
                              {cat.name}
                              <button
                                type="button"
                                className="filter-chip-clear-btn"
                                onClick={() => setLocalCategoryIds(localCategoryIds.filter(cid => cid !== cat.id))}
                              >
                                &times;
                              </button>
                            </span>
                          );
                        })
                      ) : (
                        <span className="filter-chip-empty-text">Chưa chọn thể loại nào</span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="select-popup-btn filter-select-category-btn"
                      onClick={() => {
                        setCategorySearchQuery('');
                        setCategoryModalOpen(true);
                      }}
                    >
                      <FiSearch /> Chọn thể loại
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="filter-panel-actions">
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="filter-action-btn reset"
                    >
                      <FiRefreshCw /> Đặt lại
                    </button>
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="filter-action-btn submit"
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
        <div className="author-modal-overlay navbar-modal-overlay" onClick={() => setCategoryModalOpen(false)}>
          <div className="auth-card modal-card-small bdf-modal-500" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setCategoryModalOpen(false)}
              className="modal-close-btn navbar-modal-close-btn"
              title="Đóng"
              type="button"
            >
              &times;
            </button>

            <h3 className="auth-title modal-title-small navbar-modal-title">
              <FiSearch /> Tìm kiếm & Chọn thể loại
            </h3>
            <p className="auth-subtitle modal-subtitle-small navbar-modal-subtitle">
              Chọn các thể loại để lọc sách
            </p>

            <div className="auth-form-group modal-form-group">
              <input
                type="text"
                className="admin-input navbar-search-input-field"
                value={categorySearchQuery}
                onChange={(e) => {
                  setCategorySearchQuery(e.target.value);
                  setModalPage(0);
                }}
                placeholder="Nhập tên thể loại cần tìm..."
                autoFocus
              />
            </div>

            <div className="search-results-list bdf-category-grid">
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
                      className={`category-search-item bdf-cat-item ${isChecked ? 'active' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => { }} // Controlled via onClick on parent
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

            {/* Pagination for Categories inside Modal */}
            {modalTotalPages > 0 && (
              <div className="bdf-modal-pagination">
                <button
                  type="button"
                  className="bdf-modal-page-btn"
                  disabled={modalPage === 0}
                  onClick={() => setModalPage(prev => prev - 1)}
                >
                  Trang trước
                </button>
                <span className="bdf-modal-page-info">
                  Trang {modalPage + 1} / {modalTotalPages}
                </span>
                <button
                  type="button"
                  className="bdf-modal-page-btn"
                  disabled={modalPage === modalTotalPages - 1 || modalTotalPages === 0}
                  onClick={() => setModalPage(prev => prev + 1)}
                >
                  Trang sau
                </button>
              </div>
            )}

            <button
              type="button"
              className="admin-submit-btn navbar-modal-confirm-btn"
              onClick={() => setCategoryModalOpen(false)}
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
