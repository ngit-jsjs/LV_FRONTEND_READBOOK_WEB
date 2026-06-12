import React, { useState } from 'react';
import { FiMoon, FiSave, FiTrash2 } from 'react-icons/fi';


function StudioEditor({ studioData }) {
  const { 
    title, setTitle, 
    content, setContent,
    isPublished, setIsPublished,
    isFree, setIsFree,
    price, setPrice,
    handleSave, saving, error,
    selectedChapter, handleDelete,
    handleBack
  } = studioData || {};

  return (
    <main className="studio-editor">
      

     
      {/* Editor Content Area */}
      <div className="editor-content-area">
        <div className="editor-content-wrapper">
          <input 
            type="text" 
            className="editor-title-input" 
            value={title || ''}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề chương"
          />
          
          <textarea 
            className="editor-textarea"
            value={content || ''}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập nội dung chương..."
          />
        </div>
      </div>

      {/* Editor Bottom Bar */}
      <div className="editor-bottombar">
        <div className="bottombar-left">
          <select 
            className="bottombar-select"
            value={isPublished ? 'published' : 'draft'}
            onChange={(e) => setIsPublished(e.target.value === 'published')}
          >
            <option value="draft">Bản nháp</option>
            <option value="published">Xuất bản</option>
          </select>
          
          <label className="bottombar-label">
            <input type="checkbox" checked={!isFree} onChange={(e) => setIsFree(!e.target.checked)} /> Trả phí
          </label>
          
          {!isFree && (
            <input 
              type="number" 
              placeholder="Giá (Xu)" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              className="bottombar-input"
            />
          )}

          {handleBack && (
            <button 
              className="bottombar-back-btn" 
              onClick={handleBack}
            >
              Quay lại
            </button>
          )}

          <button 
            className="btn-create-minimal bottombar-save-btn" 
            onClick={handleSave} 
            disabled={saving}
          >
             {saving ? 'Đang lưu...' : <><FiSave /> Lưu chương</>}
          </button>
          
          {selectedChapter && (
             <button 
               className="bottombar-delete-btn" 
               onClick={() => handleDelete(selectedChapter.id)}
               title="Xóa chương"
             >
               <FiTrash2 />
             </button>
          )}
          
          {error && <span className="bottombar-error">{error}</span>}
        </div>

       
      </div>
    </main>
  );
}

export default StudioEditor;
