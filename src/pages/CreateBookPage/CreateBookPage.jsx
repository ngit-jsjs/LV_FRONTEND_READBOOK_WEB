import React from 'react';
import { FiChevronLeft, FiSave } from 'react-icons/fi';
import { ROUTES } from '../../config/routes';
import { useCreateBook } from '../../hooks/useCreateBook';
import CoverUpload from '../../components/CoverUpload/CoverUpload';
import BookDetailsForm from '../../components/BookDetailsForm/BookDetailsForm';
import './CreateBookPage.css';

function CreateBookPage() {
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
    displayTitle,
    handleImageUpload,
    handleSave,
    navigate
  } = useCreateBook();

  return (
    <div className="create-book-page">
      {/* Header */}
      <header className="create-book-header">
        <button className="back-btn" onClick={() => navigate(ROUTES.AUTHOR_DASHBOARD)}>
          <FiChevronLeft />
        </button>
        <div className="header-titles">
          <span className="header-subtitle">Thêm Thông Tin Truyện</span>
          <h1 className="header-title">{displayTitle}</h1>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button
            className="btn-create-minimal"
            onClick={handleSave}
            disabled={isSubmitting}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {isSubmitting ? 'Đang lưu...' : <><FiSave /> Lưu & Tiếp tục</>}
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

export default CreateBookPage;
