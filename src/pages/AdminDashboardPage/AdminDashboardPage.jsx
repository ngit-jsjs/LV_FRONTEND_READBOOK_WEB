import React from 'react';
import { useSearchParams } from 'react-router-dom';
import BookManagementPage from '../BookManagementPage/BookManagementPage';
import UserManagementPage from '../UserManagementPage/UserManagementPage';
import CategoriesPage from '../CategoriesPage/CategoriesPage';
import AuthorsPage from '../AuthorsPage/AuthorsPage';
import PublishersPage from '../PublishersPage/PublishersPage';
import { FiBookOpen, FiGrid, FiUsers, FiUser, FiBookmark } from 'react-icons/fi';

function AdminDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'books';

  return (
    <div className="admin-dashboard-container">

      {/* Tabs */}
      <div className="admin-dashboard-tabs">
        <button
          onClick={() => setSearchParams({ tab: 'books' })}
          className={`admin-tab-btn ${activeTab === 'books' ? 'active' : ''}`}
        >
          <FiBookOpen /> Quản lý sách
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'categories' })}
          className={`admin-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
        >
          <FiGrid /> Quản lý thể loại
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'authors' })}
          className={`admin-tab-btn ${activeTab === 'authors' ? 'active' : ''}`}
        >
          <FiUser /> Quản lý tác giả
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'publishers' })}
          className={`admin-tab-btn ${activeTab === 'publishers' ? 'active' : ''}`}
        >
          <FiBookmark /> Quản lý nhà xuất bản
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'users' })}
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
        >
          <FiUsers /> Quản lý người dùng
        </button>
      </div>

      {/* Content Area */}
      <div className="admin-dashboard-content">
        {activeTab === 'books' && <BookManagementPage isSubComponent={true} />}
        {activeTab === 'categories' && <CategoriesPage isSubComponent={true} />}
        {activeTab === 'authors' && <AuthorsPage isSubComponent={true} />}
        {activeTab === 'publishers' && <PublishersPage isSubComponent={true} />}
        {activeTab === 'users' && <UserManagementPage isSubComponent={true} />}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
