import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/AuthPages/LoginPage';
import RegisterPage from './pages/AuthPages/RegisterPage';
import ForgotPasswordPage from './pages/AuthPages/ForgotPasswordPage';
import VerifyEmailPage from './pages/AuthPages/VerifyEmailPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import ProfileEditPage from './pages/ProfilePage/ProfileEditPage';
import RecentlyReadPage from './pages/ProfilePage/RecentlyReadPage';
import FollowedBooksPage from './pages/ProfilePage/FollowedBooksPage';
import ReviewedBooksPage from './pages/ProfilePage/ReviewedBooksPage';
import PremiumPage from './pages/PremiumPage/PremiumPage';
import ChapterManagementPage from './pages/ChapterManagementPage/ChapterManagementPage';
import BookEditorPage from './pages/BookEditorPage/BookEditorPage';
import BookDetailPage from './pages/BookDetailPage/BookDetailPage';
import ChapterReadPage from './pages/ChapterReadPage/ChapterReadPage';

import AdminDashboardPage from './pages/AdminDashboardPage/AdminDashboardPage';
import AdminUserPaymentHistoryPage from './pages/UserManagementPage/AdminUserPaymentHistoryPage';
import AdminUserChapterPurchasesPage from './pages/UserManagementPage/AdminUserChapterPurchasesPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import TransactionHistoryPage from './pages/ProfilePage/TransactionHistoryPage';
import PaymentResultPage from './pages/PremiumPage/PaymentResultPage';
import { ROUTES } from './config/routes';

function NotFoundPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 120px)',
      textAlign: 'center',
      padding: '40px 20px',
      color: '#fff'
    }}>
      <h1 style={{ fontSize: '6rem', fontWeight: '800', margin: '0', color: 'var(--accent-purple, #8b5cf6)' }}>404</h1>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '700', margin: '12px 0 8px' }}>Trang không tồn tại</h2>
      <p style={{ color: 'var(--text-muted, #94a3b8)', fontSize: '1rem', marginBottom: '32px' }}>
        Đường dẫn bạn truy cập không hợp lệ hoặc đã bị xóa.
      </p>
      <Link
        to={ROUTES.HOME}
        style={{
          padding: '12px 28px',
          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
          color: '#fff',
          borderRadius: '10px',
          textDecoration: 'none',
          fontWeight: '700',
          fontSize: '1rem'
        }}
      >
        Về trang chủ
      </Link>
    </div>
  );
}

function App() {

  return (
    <div className="app">
      <Navbar />

      <main className="app-main">
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
          <Route 
            path={ROUTES.PROFILE} 
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={ROUTES.PROFILE_EDIT} 
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <ProfileEditPage />
              </ProtectedRoute>
            } 
          />
          <Route
            path={ROUTES.RECENTLY_READ}
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <RecentlyReadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FOLLOWED_BOOKS}
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <FollowedBooksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FOLLOWED_BOOKS_DETAIL}
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <FollowedBooksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.REVIEWED_BOOKS}
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <ReviewedBooksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.UNRATED_BOOKS}
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <ReviewedBooksPage />
              </ProtectedRoute>
            }
          />
          <Route path={ROUTES.SEARCH} element={<HomePage />} />
          <Route path={ROUTES.PREMIUM} element={<PremiumPage />} />
          <Route path={ROUTES.BOOK_DETAIL} element={<BookDetailPage />} />
          <Route path={ROUTES.CHAPTER_READ} element={<ChapterReadPage />} />

          <Route
            path={ROUTES.TRANSACTION_HISTORY}
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <TransactionHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PAYMENT_RESULT}
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <PaymentResultPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_USER_PAYMENT_HISTORY}
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminUserPaymentHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ADMIN_USER_CHAPTER_PURCHASES}
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminUserChapterPurchasesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.CHAPTER_MANAGEMENT}
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <ChapterManagementPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.CREATE_BOOK}
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <BookEditorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.EDIT_BOOK}
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <BookEditorPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
