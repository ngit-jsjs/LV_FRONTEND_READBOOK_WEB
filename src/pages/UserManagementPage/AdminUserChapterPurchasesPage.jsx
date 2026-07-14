import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import chapterService from '../../services/chapterService';
import userService from '../../services/userService';
import { ROUTES } from '../../config/routes';
import { FiArrowLeft, FiBookOpen, FiBook, FiShoppingCart, FiUser } from 'react-icons/fi';
import { FaCoins } from 'react-icons/fa';
import { getErrorMessage } from '../../services/apiClient';
import Pagination from '../../components/Pagination/Pagination';

function AdminUserChapterPurchasesPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [unlocks, setUnlocks] = useState([]);
  const [allUnlocks, setAllUnlocks] = useState([]); // Used to calculate summary stats
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, page]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [unlockRes, userRes, allUnlockRes] = await Promise.all([
        chapterService.getAdminUserUnlocks(userId, page - 1, 10),
        userService.getUserById(userId).catch(() => null),
        chapterService.getAdminUserUnlocks(userId, 0, 1000).catch(() => ({ result: { content: [] } }))
      ]);

      if (unlockRes.result) {
        setUnlocks(unlockRes.result.content || []);
        setTotalPages(unlockRes.result.totalPages || 0);
        setTotalElements(unlockRes.result.totalElements || 0);
      }

      if (allUnlockRes.result) {
        setAllUnlocks(allUnlockRes.result.content || []);
      }

      if (userRes?.result) {
        setUserInfo(userRes.result);
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch sử mua chương của user:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const totalCoinsSpent = allUnlocks.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto', minHeight: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px', borderBottom: '1px solid var(--border-color, #1e293b)', paddingBottom: '20px' }}>
        <button 
          onClick={() => navigate(ROUTES.USER_MANAGEMENT)}
          style={{ 
            background: 'none', border: 'none', color: 'var(--text-muted, #94a3b8)', 
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', 
            fontSize: '0.95rem', padding: 0, marginBottom: '16px', transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted, #94a3b8)'}
        >
          <FiArrowLeft /> Quay lại quản lý người dùng
        </button>
        
        <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 0 8px 0', color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FiShoppingCart style={{ color: 'var(--accent-purple, #8b5cf6)' }} /> Lịch sử mua chương sách
        </h1>

        {/* User Info Badge */}
        {userInfo && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '12px', padding: '8px 16px', marginTop: '8px'
          }}>
            <FiUser style={{ color: '#8b5cf6' }} />
            <span style={{ color: '#fff', fontWeight: '600' }}>{userInfo.name || userInfo.username}</span>
            <span style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem' }}>({userInfo.email})</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <button
            onClick={() => navigate(ROUTES.ADMIN_USER_PAYMENT_HISTORY.replace(':userId', userId))}
            style={{
              background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)',
              color: '#d8b4fe', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer',
              fontSize: '0.9rem', fontWeight: '600', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', gap: '6px'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)'; }}
          >
            <FaCoins /> Xem lịch sử nạp xu
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      {!loading && !error && totalElements > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(139, 92, 246, 0.05))',
            border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '16px', padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: '16px'
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiBookOpen style={{ fontSize: '22px', color: '#8b5cf6' }} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>{totalElements}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted, #94a3b8)' }}>Chương đã mua</div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(251, 191, 36, 0.05))',
            border: '1px solid rgba(251, 191, 36, 0.25)', borderRadius: '16px', padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: '16px'
          }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(139, 92, 246, 0.2)', borderTopColor: '#8b5cf6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          Đang tải lịch sử...
        </div>
      ) : error ? (
        <div style={{ color: '#ef4444', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>
      ) : unlocks.length > 0 ? (
        <>
          <div style={{ overflowX: 'auto', background: 'rgba(17, 19, 40, 0.6)', border: '1px solid var(--border-color, #1e293b)', borderRadius: '16px', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#fff' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color, #1e293b)', background: 'rgba(255, 255, 255, 0.02)' }}>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tên sách</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chương</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Giá xu</th>
                  <th style={{ padding: '16px 20px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Thời gian mua</th>
                </tr>
              </thead>
              <tbody>
                {unlocks.map((item, index) => (
                  <tr 
                    key={item.chapterId || index} 
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(139, 92, 246, 0.04)'}
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
                        color: 'var(--accent-purple, #8b5cf6)', fontWeight: '600',
                        background: 'rgba(139, 92, 246, 0.1)', padding: '4px 10px',
                        borderRadius: '8px', fontSize: '0.9rem'
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
        <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed var(--border-color, #1e293b)', borderRadius: '16px' }}>
          <FiShoppingCart size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted, #94a3b8)', margin: 0 }}>Người dùng này chưa mở khóa bất kỳ chương sách nào.</p>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default AdminUserChapterPurchasesPage;
