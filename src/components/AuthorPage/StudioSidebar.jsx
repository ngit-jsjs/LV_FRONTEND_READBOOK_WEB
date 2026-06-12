import React, { useState } from 'react';
import { FiBook, FiSettings, FiPlus, FiChevronDown, FiChevronRight, FiCheck } from 'react-icons/fi';
import { getFormattedImageUrl } from '../../utils/imageUtils';


function StudioSidebar({ studioData }) {
  const { book, chapters, selectedChapter, handleSelectChapter, handleCreateNewChapter } = studioData || {};
  const [showChapters, setShowChapters] = useState(true);

  return (
    <aside className="studio-sidebar">
      {/* Story Info */}
      <div className="sidebar-story-info">
        <div className="story-cover-row">
          <img 
            src={getFormattedImageUrl(book?.coverImage || book?.coverImageUrl) || "https://via.placeholder.com/100x150?text=No+Cover"} 
            alt={book?.title || "Book Title"} 
            className="story-cover"
          />
          <div className="story-details">
            <h3 className="story-title">{book?.title || "Đang tải..."} <span>✎</span></h3>
            <div className="story-status">
              <span className={`status-dot ${book?.status?.toLowerCase() || 'draft'}`}></span> {book?.status || 'Draft'}
            </div>
          </div>
        </div>

      </div>

      <div className="sidebar-divider"></div>

      {/* Main Menu */}
      <div className="sidebar-menu">
       
        <button 
          className={`menu-item ${showChapters ? 'active' : ''}`}
          onClick={() => setShowChapters(!showChapters)}
        >
          <FiBook className="menu-icon" /> Chương truyện
        </button>
  
        <button className="menu-item">
          <FiSettings className="menu-icon" /> Cài đặt truyện
        </button>
      </div>

      {showChapters && (
      <>
        <div className="sidebar-divider"></div>

        {/* Chapters List */}
        <div className="sidebar-chapters">
          <div className="chapters-header">
            <h4>Danh sách chương ({chapters?.length || 0})</h4>
            <button className="btn-new-chapter" onClick={() => handleCreateNewChapter()}>
              <FiPlus /> Chương mới
            </button>
          </div>

          <div className="arc-list">
            <div className="arc-item">
              <div className="arc-chapters arc-chapters-visible">
                {chapters?.map(chapter => (
                  <div 
                    key={chapter.id} 
                    className={`chapter-item ${selectedChapter?.id === chapter.id ? 'active' : ''}`}
                    onClick={() => handleSelectChapter(chapter)}
                  >
                    <span className="chapter-dot"></span>
                    <span className="chapter-name">{chapter.title}</span>
                    {chapter.isPublished && <FiCheck className="chapter-status-icon published" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
      )}
    </aside>
  );
}

export default StudioSidebar;
