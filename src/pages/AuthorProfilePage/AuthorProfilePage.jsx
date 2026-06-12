import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBookOpen, FiUser, FiMail, FiAward } from 'react-icons/fi';
import BookCard from '../../components/BookCard/BookCard';
import { useAuthorProfile } from '../../hooks/useAuthorProfile';


function AuthorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { author, books, loading, error, page, setPage, totalPages } = useAuthorProfile(id);

  if (loading) {
    return (
      <div className="author-profile-page container">
        <div className="ap-loading">Đang tải hồ sơ tác giả...</div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="author-profile-page container">
        <div className="ap-error">
          <h3>Oops!</h3>
          <p>{error || "Không tìm thấy hồ sơ người dùng."}</p>
          <button className="ap-btn primary" onClick={() => navigate(-1)}>Quay lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="author-profile-page">
      {/* Banner / Header */}
      <div className="ap-header">
        <div className="container">
          <button className="ap-back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Quay lại
          </button>
        </div>
      </div>

      <div className="container ap-main">
        {/* Profile Card */}
        <div className="ap-profile-card">
          
          
          <div className="ap-info">
            <h1 className="ap-name">{author.name || 'Người dùng ẩn danh'}</h1>
            
            <div className="ap-meta">
              {author.email && (
                <span className="ap-meta-item">
                  <FiMail /> {author.email}
                </span>
              )}
              {author.roles && author.roles.length > 0 && (
                <span className="ap-meta-item">
                  <FiAward /> {author.roles.join(', ')}
                </span>
              )}
            </div>
            
            <div className="ap-bio">
              {author.bio ? (
                <p>{author.bio}</p>
              ) : (
                <p className="no-bio">Thành viên này chưa cập nhật phần giới thiệu.</p>
              )}
            </div>
          </div>
        </div>

        {/* Books Section */}
        <div className="ap-books-section">
          <div className="ap-section-header">
            <h2 className="ap-section-title">
              <FiBookOpen /> Tác phẩm đã đăng ({books.length})
            </h2>
          </div>

          {books.length > 0 ? (
            <>
              <div className="books-grid">
                {books.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>

              {totalPages > 0 && (
                <div className="ap-pagination">
                  <button 
                    disabled={page <= 0} 
                    onClick={() => setPage(0)}
                    className="ap-pagination-btn"
                  >
                    &laquo; Đầu
                  </button>
                  <button 
                    disabled={page <= 0} 
                    onClick={() => setPage(p => p - 1)}
                    className="ap-pagination-btn"
                  >
                    Trước
                  </button>
                  <span className="ap-pagination-info">Trang {page + 1} / {totalPages}</span>
                  <button 
                    disabled={page >= totalPages - 1} 
                    onClick={() => setPage(p => p + 1)}
                    className="ap-pagination-btn"
                  >
                    Sau
                  </button>
                  <button 
                    disabled={page >= totalPages - 1} 
                    onClick={() => setPage(totalPages - 1)}
                    className="ap-pagination-btn"
                  >
                    Cuối &raquo;
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="ap-empty">
              Tác giả này chưa đăng tác phẩm nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthorProfilePage;
