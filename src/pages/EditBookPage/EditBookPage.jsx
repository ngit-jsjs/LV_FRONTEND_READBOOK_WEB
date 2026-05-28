import React from 'react';
import { FiChevronLeft, FiSave } from 'react-icons/fi';
import { ROUTES } from '../../config/routes';
import { useEditBook } from '../../hooks/useEditBook';
import CoverUpload from '../../components/CoverUpload/CoverUpload';
import BookDetailsForm from '../../components/BookDetailsForm/BookDetailsForm';
import '../CreateBookPage/CreateBookPage.css'; // Reuses base layout styles
import './EditBookPage.css'; // Extra page specific overrides

function EditBookPage() {
  const {
    title, setTitle,
    description, setDescription,
    author, setAuthor,
    publisher, setPublisher,
    year, setYear,
    status, setStatus,
    coverImage,
    errors,
    isSubmitting,
    isLoading,
    displayTitle,
    handleImageUpload,
    handleSave,
    navigate
  } = useEditBook();

  if (isLoading) {
    return (
      <div className="create-book-page edit-book-loading">
        <div className="edit-book-loading-text">Đang tải thông tin tác phẩm...</div>
      </div>
    );
  }

  return (
    <div className="create-book-page">
      {/* Header */}
      <header className="create-book-header">
        <button className="back-btn" onClick={() => navigate(ROUTES.AUTHOR_DASHBOARD)}>
          <FiChevronLeft />
        </button>
        <div className="header-titles">
          <span className="header-subtitle">Sửa Thông Tin Truyện</span>
          <h1 className="header-title">{displayTitle}</h1>
        </div>
        <div className="edit-book-header-actions">
          <button
            className="btn-create-minimal btn-save-edit"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang lưu...' : <><FiSave /> Lưu thay đổi</>}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="create-book-content">
        <CoverUpload 
          coverImage={coverImage} 
          handleImageUpload={handleImageUpload} 
        />

        <BookDetailsForm 
          title={title} setTitle={setTitle}
          author={author} setAuthor={setAuthor}
          year={year} setYear={setYear}
          status={status} setStatus={setStatus}
          publisher={publisher} setPublisher={setPublisher}
          description={description} setDescription={setDescription}
          errors={errors}
        />
      </div>
    </div>
  );
}

export default EditBookPage;
