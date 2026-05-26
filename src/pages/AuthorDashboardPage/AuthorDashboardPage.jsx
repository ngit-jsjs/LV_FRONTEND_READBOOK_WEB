import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit3, FiTrendingUp, FiEye, FiClock } from 'react-icons/fi';
import CreateBookModal from '../../components/AuthorPage/CreateBookModal';
import { ROUTES } from '../../config/routes';
import './AuthorDashboardPage.css';



function AuthorDashboardPage() {
  const [showModal, setShowModal] = useState(false);
  const [books, setBooks] = useState([]); // Chờ API

  return (
    <div className="author-dashboard-page container">
      <div className="dashboard-header-minimal">
        <h1 className="dashboard-title-minimal">
          Tác phẩm của tôi <span className="book-count">({books.length})</span>
        </h1>
        <button className="btn-create-minimal" onClick={() => setShowModal(true)}>
          <FiPlus /> Mới
        </button>
      </div>

      <div className="books-grid-minimal">
        {books.length > 0 ? (
          books.map(book => (
            <Link to={ROUTES.AUTHOR_STUDIO} key={book.id} className="book-card-minimal">
              <div className="book-card-top">
                <h3 className="book-title-minimal">{book.title}</h3>
                <button className="btn-more-options">...</button>
              </div>
              
              <div className="book-card-bottom">
                <span className="book-time-minimal"><FiClock /> {book.lastUpdated}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="empty-state-minimal">
            Bạn chưa có tác phẩm nào. Hãy bấm nút "Mới" để tạo tiểu thuyết đầu tiên nhé!
          </div>
        )}
      </div>

      {showModal && <CreateBookModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default AuthorDashboardPage;
