import { Link } from 'react-router-dom';
import BookCard from '../BookCard/BookCard';
import './BookSection.css';

/**
 * BookSection - Section hiển thị danh sách sách
 * 
 * Props:
 *   - title: string          // Tiêu đề section (vd: "Trending Now")
 *   - icon: React element    // Icon bên cạnh tiêu đề
 *   - books: array           // Mảng các object sách (truyền xuống BookCard)
 *   - viewAllLink: string    // Link "View All" (vd: "/trending")
 */
function BookSection({ title, icon, books = [], viewAllLink = '#', showRank = false }) {
  return (
    <section className="book-section">
      <div className="container">

        {/* Header: tiêu đề + View All */}
        <div className="book-section-header">
          <h2 className="book-section-title">
            {icon && <span className="book-section-title-icon">{icon}</span>}
            {title}
          </h2>
          <Link to={viewAllLink} className="book-section-view-all">
            Hiển thị tất cả →
          </Link>
        </div>

        {/* Grid các sách */}
        <div className="books-grid-minimal">
          {books.length > 0 ? (
            // Nếu có sách → render BookCard cho mỗi cuốn
            books.map((book, index) => (
              <BookCard 
                key={book.id || index} 
                book={book} 
                rank={showRank ? index + 1 : undefined}
              />
            ))
          ) : (
            <div className="book-section-empty">
              Chưa có sách nào
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default BookSection;
