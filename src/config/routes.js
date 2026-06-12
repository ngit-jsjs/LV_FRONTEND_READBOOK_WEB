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

  
  PROFILE: '/profile',
  PROFILE_EDIT: '/profile/edit',
  RECENTLY_READ: '/profile/recently-read',
  FOLLOWED_BOOKS: '/profile/followed-books',
  
  ADMIN: '/admin',
  
  AUTHOR_DASHBOARD: '/author',
  AUTHOR_STUDIO: '/author/studio/:bookId',
  AUTHOR_STUDIO_CHAPTER_NEW: '/author/studio/:bookId/chapter/new',
  AUTHOR_PROFILE: '/user/:id',
  CREATE_BOOK: '/author/create',
  EDIT_BOOK: '/author/edit/:id',
};
