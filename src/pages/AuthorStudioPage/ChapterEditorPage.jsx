import React from 'react';
import StudioEditor from '../../components/AuthorPage/StudioEditor';
import { useChapterEditor } from '../../hooks/useChapterEditor';

function ChapterEditorPage() {
  const {
    loading,
    title,
    setTitle,
    content,
    setContent,
    isPublished,
    setIsPublished,
    isFree,
    setIsFree,
    price,
    setPrice,
    isFocusMode,
    setIsFocusMode,
    handleSave,
    saving,
    error,
    selectedChapter,
    handleDelete,
    handleBack
  } = useChapterEditor();

  const studioData = {
    title, setTitle,
    content, setContent,
    isPublished, setIsPublished,
    isFree, setIsFree,
    price, setPrice,
    handleSave, saving, error,
    selectedChapter, handleDelete,
    handleBack
  };

  if (loading) {
    return <div className="studio-page loading">Đang tải...</div>;
  }

  return (
    <div className="studio-page focus-mode">
      <div className="studio-workspace">
        <StudioEditor isFocusMode={isFocusMode} setIsFocusMode={setIsFocusMode} studioData={studioData} />
      </div>
    </div>
  );
}

export default ChapterEditorPage;
