import { FaStar } from 'react-icons/fa';
import { MdMenuBook } from 'react-icons/md';
import { Link } from 'react-router-dom';
import './BookCard.css';

/**
 * BookCard - Hiển thị thông tin 1 cuốn sách
 * 
 * Props:
 *   - book: object {
 *       title: string,       // Tên sách
 *       author: string,      // Tên tác giả
 *       coverImage: string,  // URL ảnh bìa
 *       rating: number,      // Điểm đánh giá (vd: 4.8)
 *       reads: string,       // Lượt đọc (vd: "2.4M reads")
 *     }
 */
function BookCard({ book }) {
  // Nếu không có book, không render gì
  if (!book) return null;

  return (
    <Link to={`/book-details/${book.slug}`} className="book-card">

      {/* Ảnh bìa */}
      <div className="book-card-cover">
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} />
        ) : (
          // Placeholder khi chưa có ảnh
          <div className="book-card-cover-placeholder">
            <MdMenuBook />
          </div>
        )}
      </div>

      {/* Tên sách */}
      <div className="book-card-title">{book.title || 'Untitled'}</div>

      {/* Tên tác giả */}
      <div className="book-card-author">{book.author || 'Unknown Author'}</div>

      {/* Rating + lượt đọc */}
      <div className="book-card-stats">
        {book.rating && (
          <span className="book-card-rating">
            <FaStar className="star-icon" />
            {book.rating}
          </span>
        )}
        {book.reads && (
          <span>{book.reads}</span>
        )}
      </div>

    </Link>
  );
}

export default BookCard;
