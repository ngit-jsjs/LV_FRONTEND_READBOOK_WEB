import { Routes, Route } from 'react-router-dom';
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
import PremiumPage from './pages/PremiumPage/PremiumPage';
import ChapterManagementPage from './pages/ChapterManagementPage/ChapterManagementPage';
import BookManagementPage from './pages/BookManagementPage/BookManagementPage';
import BookEditorPage from './pages/BookEditorPage/BookEditorPage';
import BookDetailPage from './pages/BookDetailPage/BookDetailPage';
import ChapterReadPage from './pages/ChapterReadPage/ChapterReadPage';

import AdminPage from './pages/AdminPage/AdminPage';
import CategoriesPage from './pages/CategoriesPage/CategoriesPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import SubscriptionHistoryPage from './pages/ProfilePage/SubscriptionHistoryPage';
import PaymentResultPage from './pages/PremiumPage/PaymentResultPage';
import { ROUTES } from './config/routes';

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
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.PROFILE_EDIT} element={<ProfileEditPage />} />
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
          <Route path={ROUTES.SEARCH} element={<HomePage />} />
          <Route path={ROUTES.CATEGORIES} element={<CategoriesPage />} />
          <Route path={ROUTES.PREMIUM} element={<PremiumPage />} />
          <Route path={ROUTES.BOOK_DETAIL} element={<BookDetailPage />} />
          <Route path={ROUTES.CHAPTER_READ} element={<ChapterReadPage />} />

          <Route 
            path={ROUTES.SUBSCRIPTIONS} 
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <SubscriptionHistoryPage />
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
            path={ROUTES.ADMIN} 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path={ROUTES.BOOK_MANAGEMENT} 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <BookManagementPage />
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

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
