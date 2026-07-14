import React, { useState, useEffect } from 'react';
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
  const [allUnlocks, setAllUnlocks] = useState([]);
  const [unlockLoading, setUnlockLoading] = useState(true);
  const [unlockError, setUnlockError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

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
  }, [user, activeTab, page]);

  const fetchSubscriptions = async () => {
    setSubLoading(true);
    setSubError('');
    try {
      const res = await subscriptionService.getMySubscriptions();
      if (res.result) {
        setSubscriptions(res.result);
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch sử nạp xu:", err);
      setSubError(getErrorMessage(err));
    } finally {
      setSubLoading(false);
    }
  };

  const fetchUnlocks = async () => {
    setUnlockLoading(true);
    setUnlockError('');
    try {
      const [pageRes, allRes] = await Promise.all([
        chapterService.getMyUnlocks(page - 1, 10),
        chapterService.getMyUnlocks(0, 1000).catch(() => ({ result: { content: [] } }))
      ]);

      if (pageRes.result) {
        setUnlocks(pageRes.result.content || []);
        setTotalPages(pageRes.result.totalPages || 0);
        setTotalElements(pageRes.result.totalElements || 0);
      }

      if (allRes.result) {
        setAllUnlocks(allRes.result.content || []);
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch sử mua chương:", err);
      setUnlockError(getErrorMessage(err));
    } finally {
      setUnlockLoading(false);
    }
  };

  if (!user) return null;

  const totalCoinsSpent = allUnlocks.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div className="transaction-page-container">
      <div className="transaction-page-header">
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '0 0 8px 0', color: '#fff', fontFamily: '"Noto Serif SC", serif' }}>
          Lịch sử giao dịch
        </h1>
        <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.95rem', margin: 0 }}>
          Theo dõi lịch sử nạp xu và mua chương truyện của bạn.
        </p>
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
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div className="spinner" />
              Đang tải lịch sử nạp xu...
            </div>
          ) : subError ? (
            <div className="error-message">{subError}</div>
          ) : subscriptions.length > 0 ? (
            <div style={{ overflowX: 'auto', background: 'rgba(17, 19, 40, 0.6)', border: '1px solid var(--border-color, #1e293b)', borderRadius: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#fff' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color, #1e293b)', background: 'rgba(255, 255, 255, 0.02)' }}>
                    <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Mã GD</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Gói xu</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Giá tiền</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Số xu nhận</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Thời gian</th>
                    <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((sub) => (
                    <tr 
                      key={sub.id} 
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: 'var(--text-muted, #94a3b8)' }}>#{sub.id}</td>
                      <td style={{ padding: '16px 20px', fontWeight: '600' }}>{sub.planName}</td>
                      <td style={{ padding: '16px 20px' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(sub.planPrice)}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#fbbf24', fontWeight: '700' }}>
                        +{new Intl.NumberFormat('vi-VN').format(sub.planAmount)} <FaCoins style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.9rem' }}>
                        {new Date(sub.createdAt).toLocaleDateString('vi-VN')} {new Date(sub.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        {sub.status === 'COMPLETED' ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600' }}>
                            <FiCheckCircle /> Thành công
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '4px 8px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600' }}>
                            <FiXCircle /> Thất bại
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <FiCreditCard size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
              <p style={{ color: 'var(--text-muted, #94a3b8)', margin: 0 }}>Bạn chưa thực hiện bất kỳ giao dịch mua gói xu nào.</p>
            </div>
          )}
        </>
      )}

      {/* Tab 2: Purchases */}
      {activeTab === 'purchases' && (
        <>
          {/* Summary Stats */}
          {!unlockLoading && !unlockError && totalElements > 0 && (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px', 
              marginBottom: '24px' 
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05))',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                borderRadius: '16px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'rgba(139, 92, 246, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <FiBookOpen style={{ fontSize: '22px', color: '#8b5cf6' }} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>{totalElements}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted, #94a3b8)' }}>Chương đã mua</div>
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(251, 191, 36, 0.05))',
                border: '1px solid rgba(251, 191, 36, 0.25)',
                borderRadius: '16px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  background: 'rgba(251, 191, 36, 0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <FaCoins style={{ fontSize: '20px', color: '#fbbf24' }} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fbbf24' }}>
                    {new Intl.NumberFormat('vi-VN').format(totalCoinsSpent)}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted, #94a3b8)' }}>Xu đã chi tiêu</div>
                </div>
              </div>
            </div>
          )}

          {unlockLoading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div className="spinner" />
              Đang tải lịch sử mua chương...
            </div>
          ) : unlockError ? (
            <div className="error-message">{unlockError}</div>
          ) : unlocks.length > 0 ? (
            <>
              <div style={{ overflowX: 'auto', background: 'rgba(17, 19, 40, 0.6)', border: '1px solid var(--border-color, #1e293b)', borderRadius: '16px', marginBottom: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#fff' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color, #1e293b)', background: 'rgba(255, 255, 255, 0.02)' }}>
                      <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Tên sách</th>
                      <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Chương</th>
                      <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Giá xu</th>
                      <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Thời gian mua</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unlocks.map((item, index) => (
                      <tr 
                        key={item.chapterId || index} 
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.03)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FiBook style={{ color: 'var(--accent-purple, #8b5cf6)', flexShrink: 0 }} />
                            <span style={{ fontWeight: '600' }}>
                              {item.bookTitle || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ 
                            color: 'var(--accent-purple, #8b5cf6)', 
                            fontWeight: '600',
                            background: 'rgba(139, 92, 246, 0.1)',
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.9rem'
                          }}>
                            {item.chapterTitle || `Chương ${item.chapterNumber || '?'}`}
                          </span>
                        </td>
                        <td style={{ padding: '16px 20px', color: '#fbbf24', fontWeight: '700' }}>
                          -{new Intl.NumberFormat('vi-VN').format(item.price || 0)} <FaCoins style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
                        </td>
                        <td style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.9rem' }}>
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
              <FiShoppingCart size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
              <h3 style={{ color: '#fff', marginBottom: '8px' }}>Chưa có lịch sử mua chương</h3>
              <p style={{ color: 'var(--text-muted, #94a3b8)', margin: '0 0 24px 0' }}>Bạn chưa mở khóa bất kỳ chương sách nào bằng xu.</p>
              <Link to={ROUTES.HOME} className="profile-btn primary" style={{ textDecoration: 'none', padding: '12px 24px', borderRadius: '12px', display: 'inline-block' }}>Khám phá sách ngay</Link>
            </div>
          )}
        </>
      )}

        </div>
      </div>

      {/* Styled inline helper elements */}
      <style>{`
        .spinner {
          width: 40px; 
          height: 40px; 
          border: 3px solid rgba(139, 92, 246, 0.2); 
          border-top-color: #8b5cf6; 
          border-radius: 50%; 
          animation: spin 0.8s linear infinite; 
          margin: 0 auto 16px;
        }
        .error-message {
          color: #ef4444; 
          padding: 16px; 
          background: rgba(239, 68, 68, 0.1); 
          borderRadius: 8px; 
          border: 1px solid rgba(239, 68, 68, 0.2);
        }
        .empty-state {
          text-align: center; 
          padding: 80px 20px; 
          border: 1px dashed var(--border-color, #1e293b); 
          border-radius: 20px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default TransactionHistoryPage;
