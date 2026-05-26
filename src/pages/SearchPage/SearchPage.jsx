import { useSearchParams } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import './SearchPage.css';

function SearchPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  
  return (
    <div className="search-page">
      <div className="container">
        <h1 className="search-page-title">
          Kết quả tìm kiếm sách cho: <span className="highlight">"{keyword}"</span>
        </h1>

        <div className="search-empty">
          <FiSearch className="search-empty-icon" />
          <p>Chưa có API tìm kiếm sách cho từ khóa "{keyword}"</p>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
