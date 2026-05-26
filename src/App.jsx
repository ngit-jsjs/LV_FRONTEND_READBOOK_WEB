import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/AuthPages/LoginPage';
import RegisterPage from './pages/AuthPages/RegisterPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SearchPage from './pages/SearchPage/SearchPage';
import PremiumPage from './pages/PremiumPage/PremiumPage';
import AuthorStudioPage from './pages/AuthorStudioPage/AuthorStudioPage';
import AuthorDashboardPage from './pages/AuthorDashboardPage/AuthorDashboardPage';
import { ROUTES } from './config/routes';
import './App.css';

/**
 * App - Component gốc
 * 
 * Cấu trúc:
 *   - Navbar (ẩn trên trang Login/Register)
 *   - Routes (nội dung thay đổi theo URL)
 *   - Footer (ẩn trên trang Login/Register và Profile)
 */
function App() {
  const location = useLocation();

  // Kiểm tra có đang ở trang auth không (login, register)
  const isAuthPage = [ROUTES.LOGIN, ROUTES.REGISTER].includes(location.pathname);
  
  // Kiểm tra có đang ở Author Studio không
  const isStudioPage = location.pathname.startsWith(ROUTES.AUTHOR_STUDIO);

  // Trang profile có layout riêng (full height), ẩn footer
  const isAuthorDashboard = location.pathname === ROUTES.AUTHOR_DASHBOARD;
  const hideFooter = isAuthPage || isStudioPage || isAuthorDashboard || location.pathname === ROUTES.PROFILE;
  const hideNavbar = isAuthPage;

  return (
    <div className="app">
      {/* Navbar - ẩn trên trang auth/studio */}
      {!hideNavbar && <Navbar />}

      {/* Nội dung chính */}
      <main className="app-main">
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.SEARCH} element={<SearchPage />} />
          <Route path={ROUTES.PREMIUM} element={<PremiumPage />} />
          <Route path={ROUTES.AUTHOR_DASHBOARD} element={<AuthorDashboardPage />} />
          <Route path={ROUTES.AUTHOR_STUDIO} element={<AuthorStudioPage />} />
          {/* Thêm các route khác ở đây sau */}
        </Routes>
      </main>

      {/* Footer - ẩn trên trang auth và profile */}
      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
