import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import subscriptionService from '../../services/subscriptionService';
import chapterService from '../../services/chapterService';
import { ROUTES } from '../../config/routes';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiBookOpen, FiBook, FiShoppingCart, FiCreditCard } from 'react-icons/fi';
import { FaCoins } from 'react-icons/fa';
import { getErrorMessage } from '../../services/apiClient';
import Pagination from '../../components/Pagination/Pagination';

function TransactionHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('recharges'); // 'recharges' | 'purchases'

  // State for Subscriptions (Recharges)
  const [subscriptions, setSubscriptions] = useState([]);
  const [subLoading, setSubLoading] = useState(true);
  const [subError, setSubError] = useState('');

  // State for Chapter Purchases (Unlocks)
  const [unlocks, setUnlocks] = useState([]);
  const [unlockLoading, setUnlockLoading] = useState(true);
  const [unlockError, setUnlockError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalCoinsSpent, setTotalCoinsSpent] = useState(0);

  const fetchSubscriptions = useCallback(async () => {
    setSubLoading(true);
    setSubError('');
    try {
      const res = await subscriptionService.getMySubscriptions(page - 1, 10);
      if (res.result) {
        setSubscriptions(res.result.content || []);
        setTotalPages(res.result.totalPages || 0);
        setTotalElements(res.result.totalElements || 0);
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch sử nạp xu:", err);
      setSubError(getErrorMessage(err));
    } finally {
      setSubLoading(false);
    }
  }, [page]);

  const fetchUnlocks = useCallback(async () => {
    setUnlockLoading(true);
    setUnlockError('');
    try {
      const res = await chapterService.getMyUnlocks(page - 1, 10);
      if (res.result) {
        setUnlocks(res.result.content || []);
        setTotalPages(res.result.totalPages || 0);
        setTotalElements(res.result.totalElements || 0);
        // Backend trả về tổng xu đã chi tiêu
        setTotalCoinsSpent(res.result.totalCoinsSpent || 0);
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch sử mua chương:", err);
      setUnlockError(getErrorMessage(err));
    } finally {
      setUnlockLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }

    if (activeTab === 'recharges') {
      fetchSubscriptions();
    } else {
      fetchUnlocks();
    }
  }, [user, navigate, activeTab, fetchSubscriptions, fetchUnlocks]);

  if (!user) return null;

  return (
    <div className="transaction-page-container">
      <div className="transaction-page-header">
        <h1>Lịch sử giao dịch</h1>
        <p>Theo dõi lịch sử nạp xu và mua chương truyện của bạn.</p>
      </div>

      <div className="transaction-page-main">
        {/* Tabs Switcher */}
        <div className="admin-dashboard-tabs">
          <button
            onClick={() => {
              setActiveTab('recharges');
              setPage(1);
            }}
            className={`admin-tab-btn ${activeTab === 'recharges' ? 'active' : ''}`}
          >
            <FiCreditCard /> Lịch sử nạp xu
          </button>
          <button
            onClick={() => {
              setActiveTab('purchases');
              setPage(1);
            }}
            className={`admin-tab-btn ${activeTab === 'purchases' ? 'active' : ''}`}
          >
            <FiShoppingCart /> Lịch sử mua chương
          </button>
        </div>

        {/* Content Area */}
        <div className="transaction-page-content">
          {/* Tab 1: Recharges (Subscriptions) */}
          {activeTab === 'recharges' && (
            <>
              {subLoading ? (
                <div className="tx-loader-wrapper">
                  <div className="spinner" />
                  Đang tải lịch sử nạp xu...
                </div>
              ) : subError ? (
                <div className="error-message">{subError}</div>
              ) : subscriptions.length > 0 ? (
                <>
                  <div className="tx-table-responsive">
                    <table className="tx-table">
                      <thead>
                        <tr>
                          <th>Mã GD</th>
                          <th>Gói xu</th>
                          <th>Giá tiền</th>
                          <th>Số xu nhận</th>
                          <th>Thời gian</th>
                          <th>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptions.map((sub) => (
                          <tr key={sub.id}>
                            <td className="tx-id-cell">#{sub.id}</td>
                            <td className="tx-pkg-cell">{sub.planName}</td>
                            <td>
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sub.planPrice)}
                            </td>
                            <td className="tx-coins-cell">
                              +{new Intl.NumberFormat('vi-VN').format(sub.planAmount)} <FaCoins style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
                            </td>
                            <td className="tx-date-cell">
                              {new Date(sub.createdAt).toLocaleDateString('vi-VN')} {new Date(sub.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td>
                              {sub.status === 'SUCCESS' ? (
                                <span className="tx-status-badge success">
                                  <FiCheckCircle /> Thành công
                                </span>
                              ) : sub.status === 'PENDING' ? (
                                <span className="tx-status-badge pending">
                                  Chưa thanh toán
                                </span>
                              ) : (
                                <span className="tx-status-badge failed">
                                  <FiXCircle /> Thất bại
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="tx-pagination-container">
                    <Pagination 
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={(p) => setPage(p)}
                    />
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <FiCreditCard size={48} />
                  <p style={{ margin: 0 }}>Bạn chưa thực hiện bất kỳ giao dịch mua gói xu nào.</p>
                </div>
              )}
            </>
          )}

          {/* Tab 2: Purchases */}
          {activeTab === 'purchases' && (
            <>
              {/* Summary Stats */}
              {!unlockLoading && !unlockError && totalElements > 0 && (
                <div className="tx-stats-grid">
                  <div className="tx-stat-card purchases">
                    <div className="tx-stat-icon-wrapper purchases">
                      <FiBookOpen style={{ fontSize: '22px', color: '#8b5cf6' }} />
                    </div>
                    <div className="tx-stat-val-wrapper">
                      <div className="tx-stat-val">{totalElements}</div>
                      <div className="tx-stat-label">Chương đã mua</div>
                    </div>
                  </div>

                  <div className="tx-stat-card spent">
                    <div className="tx-stat-icon-wrapper spent">
                      <FaCoins style={{ fontSize: '20px', color: '#fbbf24' }} />
                    </div>
                    <div className="tx-stat-val-wrapper">
                      <div className="tx-stat-val spent">
                        {new Intl.NumberFormat('vi-VN').format(totalCoinsSpent)}
                      </div>
                      <div className="tx-stat-label">Xu đã chi tiêu</div>
                    </div>
                  </div>
                </div>
              )}

              {unlockLoading ? (
                <div className="tx-loader-wrapper">
                  <div className="spinner" />
                  Đang tải lịch sử mua chương...
                </div>
              ) : unlockError ? (
                <div className="error-message">{unlockError}</div>
              ) : unlocks.length > 0 ? (
                <>
                  <div className="tx-table-responsive" style={{ marginBottom: '20px' }}>
                    <table className="tx-table">
                      <thead>
                        <tr>
                          <th>Tên sách</th>
                          <th>Chương</th>
                          <th>Giá xu</th>
                          <th>Thời gian mua</th>
                        </tr>
                      </thead>
                      <tbody>
                        {unlocks.map((item, index) => (
                          <tr key={item.chapterId || index}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FiBook style={{ color: 'var(--accent-purple, #8b5cf6)', flexShrink: 0 }} />
                                <span style={{ fontWeight: '600' }}>
                                  {item.bookTitle || 'N/A'}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="tx-chapter-badge">
                                {item.chapterTitle || `Chương ${item.chapterNumber || '?'}`}
                              </span>
                            </td>
                            <td className="tx-coins-cell">
                              -{new Intl.NumberFormat('vi-VN').format(item.price || 0)} <FaCoins style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
                            </td>
                            <td className="tx-date-cell">
                              {item.createdAt 
                                ? `${new Date(item.createdAt).toLocaleDateString('vi-VN')} ${new Date(item.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` 
                                : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Pagination 
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(p) => setPage(p)}
                  />
                </>
              ) : (
                <div className="empty-state">
                  <FiShoppingCart size={48} />
                  <h3>Chưa có lịch sử mua chương</h3>
                  <p style={{ margin: '0 0 24px 0' }}>Bạn chưa mở khóa bất kỳ chương sách nào bằng xu.</p>
                  <Link to={ROUTES.HOME} className="profile-btn primary">Khám phá sách ngay</Link>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default TransactionHistoryPage;

