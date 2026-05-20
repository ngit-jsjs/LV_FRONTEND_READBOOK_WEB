import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/AuthPages/LoginPage';
import RegisterPage from './pages/AuthPages/RegisterPage';
import './App.css';

/**
 * App - Component gốc
 * 
 * Cấu trúc:
 *   - Navbar (ẩn trên trang Login/Register)
 *   - Routes (nội dung thay đổi theo URL)
 *   - Footer (ẩn trên trang Login/Register)
 */
function App() {
  const location = useLocation();

  // Kiểm tra có đang ở trang auth không (login, register)
  // Trang auth sẽ ẩn Navbar và Footer
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="app">
      {/* Navbar - ẩn trên trang auth */}
      {!isAuthPage && <Navbar />}

      {/* Nội dung chính */}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Thêm các route khác ở đây sau */}
        </Routes>
      </main>

      {/* Footer - ẩn trên trang auth */}
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default App;
