import React from 'react';
import { FiChevronDown, FiImage, FiSave, FiTrash2 } from 'react-icons/fi';


function StudioRightPanel({ studioData }) {
  const { 
    title, 
    chapterNumber, setChapterNumber,
    isFree, setIsFree,
    isPublished, setIsPublished,
    price, setPrice,
    handleSave,
    saving,
    error,
    selectedChapter,
    handleDelete
  } = studioData || {};
  return (
    <aside className="studio-right-panel">
      {/* Tabs */}
      <div className="panel-tabs">
        <button className="panel-tab active">Cài đặt</button>
      </div>

      <div className="panel-content">
        {/* Chapter Info */}
        <div className="panel-section">
          <h4 className="section-heading">Thông tin chương</h4>

          <div className="form-group">
            <div className="label-row">
              <label>Số thứ tự chương</label>
            </div>
            <input 
              type="number" 
              className="panel-input" 
              value={chapterNumber} 
              onChange={(e) => setChapterNumber(e.target.value)} 
              min="1"
            />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label>Tiêu đề</label>
            </div>
            <input type="text" className="panel-input" value={title || ''} readOnly />
          </div>


        </div>

        {/* Status */}
          <div className="form-group">
            <label>Trạng thái</label>
            <select 
              className="panel-input" 
              value={isPublished ? 'published' : 'draft'}
              onChange={(e) => setIsPublished(e.target.value === 'published')}
            >
              <option value="draft">Bản nháp</option>
              <option value="published">Xuất bản</option>
            </select>
          </div>

        {/* Settings */}
        <div className="panel-section">
          <label>Thiết lập khác</label>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={!isFree}
                onChange={(e) => setIsFree(!e.target.checked)}
              />
              <span className="checkmark"></span>
              Yêu cầu VIP/Trả phí
            </label>
          </div>
          
          {!isFree && (
            <div className="form-group panel-price-group">
              <label>Giá (Xu)</label>
              <input 
                type="number" 
                className="panel-input" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
              />
            </div>
          )}
          <div className="form-group-actions">
           {error && <div className="panel-error-msg">{error}</div>}
           <button 
             className="btn-create-minimal btn-panel-save" 
             onClick={handleSave} 
             disabled={saving}
           >
              {saving ? 'Đang lưu...' : 'Lưu chương'}
           </button>
           {selectedChapter && (
             <button 
               className="btn-action-minimal delete btn-panel-delete" 
               onClick={() => handleDelete(selectedChapter.id)}
             >
               Xóa chương
             </button>
           )}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default StudioRightPanel;
