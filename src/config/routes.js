export const ROUTES = {
 
  HOME: '/',
  SEARCH: '/search',
  BOOK_DETAIL: '/book/:id',
  CHAPTER_READ: '/book/:bookId/chapter/:chapterId',
  CATEGORIES: '/admin?tab=categories',
  PREMIUM: '/premium',

 
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_EMAIL: '/verify-email',

  
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  RECENTLY_READ: '/profile/recently-read',
  FOLLOWED_BOOKS: '/profile/followed-books',
  FOLLOWED_BOOKS_DETAIL: '/profile/followed-books/:listId',
  REVIEWED_BOOKS: '/profile/reviewed-books',
  UNRATED_BOOKS: '/profile/unrated-books',
  TRANSACTION_HISTORY: '/profile/transactions',
  PAYMENT_RESULT: '/payment/result',
  
  ADMIN_DASHBOARD: '/admin',
  USER_MANAGEMENT: '/admin?tab=users',
  ADMIN_USER_PAYMENT_HISTORY: '/admin/users/:userId/payment-history',
  ADMIN_USER_CHAPTER_PURCHASES: '/admin/users/:userId/chapter-purchases',
  
  BOOK_MANAGEMENT: '/admin?tab=books',
  CHAPTER_MANAGEMENT: '/admin/books/:bookId/chapters',
  CREATE_BOOK: '/admin/books/create',
  EDIT_BOOK: '/admin/books/edit/:id',
};
