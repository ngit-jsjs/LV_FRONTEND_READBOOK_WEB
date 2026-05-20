import { MdAccessTime, MdMenuBook } from 'react-icons/md';
import './RecommendCard.css';

/**
 * RecommendCard - Card sách được đề xuất
 * 
 * Props:
 *   - book: object {
 *       title: string,        // Tên sách
 *       author: string,       // Tên tác giả
 *       description: string,  // Mô tả ngắn
 *       coverImage: string,   // URL ảnh bìa
 *       genre: string,        // Thể loại (vd: "Sci-Fi", "Fantasy")
 *     }
 */
function RecommendCard({ book }) {
  // Nếu không có book, không render gì
  if (!book) return null;

  return (
    <div className="recommend-card">

      {/* Ảnh bìa + Badge thể loại */}
      <div className="recommend-card-cover">
        {book.coverImage ? (
          <img src={book.coverImage} alt={book.title} />
        ) : (
          <div className="recommend-card-cover-placeholder">
            <MdMenuBook />
          </div>
        )}

        {/* Badge thể loại */}
        {book.genre && (
          <span className="recommend-card-badge">{book.genre}</span>
        )}
      </div>

      {/* Nội dung */}
      <div className="recommend-card-content">
        <h3 className="recommend-card-title">{book.title || 'Untitled'}</h3>
        <p className="recommend-card-author">{book.author || 'Unknown Author'}</p>
        <p className="recommend-card-description">
          {book.description || 'No description available.'}
        </p>

        {/* Nút Continue Reading */}
        <button className="recommend-card-btn">
          <MdAccessTime className="recommend-card-btn-icon" />
          Đọc tiếp
        </button>
      </div>

    </div>
  );
}

export default RecommendCard;
