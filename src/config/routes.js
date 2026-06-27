export const ROUTES = {
 
  HOME: '/',
  SEARCH: '/search',
  BOOK_DETAIL: '/book/:id',
  CHAPTER_READ: '/book/:bookId/chapter/:chapterId',
  CATEGORIES: '/categories',
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
  SUBSCRIPTIONS: '/profile/subscriptions',
  PAYMENT_RESULT: '/payment/result',
  
  ADMIN: '/admin',
  
  BOOK_MANAGEMENT: '/admin/books',
  CHAPTER_MANAGEMENT: '/admin/books/:bookId/chapters',
  CREATE_BOOK: '/admin/books/create',
  EDIT_BOOK: '/admin/books/edit/:id',
};
