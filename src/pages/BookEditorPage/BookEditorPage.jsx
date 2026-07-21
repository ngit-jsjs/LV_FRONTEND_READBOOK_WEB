import React from 'react';
import { FiChevronLeft, FiSave } from 'react-icons/fi';
import { ROUTES } from '../../config/routes';
import { useBookEditor } from '../../hooks/useBookEditor';
import CoverUpload from '../../components/CoverUpload/CoverUpload';
import BookDetailsForm from '../../components/BookDetailsForm/BookDetailsForm';

function BookEditorPage() {
  const {
    id,
    title, setTitle,
    description, setDescription,
    author, setAuthor,
    publisher, setPublisher,
    year, setYear,
    status, setStatus,
    coverImage,
    rawFile,
    categoryIds, setCategoryIds,
    allCategories,
    selectedAuthorId, setSelectedAuthorId,
    selectedPublisherId, setSelectedPublisherId,
    errors,
    isSubmitting,
    isLoading,
    handleImageUpload,
    handleSave,
    navigate
  } = useBookEditor();

  if (isLoading) {
    return (
      <div className="create-book-page edit-book-loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <div className="edit-book-loading-text">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="create-book-page">
      {/* Header */}
      <header className="create-book-header">
        <button className="back-btn" onClick={() => navigate(ROUTES.BOOK_MANAGEMENT)}>
          <FiChevronLeft />
        </button>
        <div className="header-titles">
          <h1 className="header-title">
            {id ? 'Sửa Thông Tin Truyện' : 'Thêm Thông Tin Truyện'}
          </h1>
        </div>
        <div className="edit-book-header-actions" style={{ marginLeft: 'auto' }}>
          <button
            className="btn-create-minimal"
            onClick={handleSave}
            disabled={isSubmitting}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {isSubmitting ? (
              'Đang lưu...'
            ) : (
              <>
                <FiSave /> {id ? 'Lưu thay đổi' : 'Lưu & Tiếp tục'}
              </>
            )}
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
          allCategories={allCategories}
          categoryIds={categoryIds}
          setCategoryIds={setCategoryIds}
          selectedAuthorId={selectedAuthorId}
          setSelectedAuthorId={setSelectedAuthorId}
          selectedPublisherId={selectedPublisherId}
          setSelectedPublisherId={setSelectedPublisherId}
        />
      </div>
    </div>
  );
}

export default BookEditorPage;
