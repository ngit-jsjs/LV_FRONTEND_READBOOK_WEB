import React from 'react';
import { FiChevronDown, FiImage } from 'react-icons/fi';
import './StudioRightPanel.css';

function StudioRightPanel() {
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
              <label>Tiêu đề</label>
              <span className="char-count">28/100</span>
            </div>
            <input type="text" className="panel-input" value="Chương 5: Ánh Sao Rơi" readOnly />
          </div>


        </div>

        {/* Status */}
        <div className="panel-section">
          <div className="form-group">
            <label>Trạng thái</label>
            <div className="custom-select">
              <div className="select-value">
                <span className="status-dot draft"></span> Bản nháp
              </div>
              <FiChevronDown />
            </div>
          </div>

          <div className="form-group">
            <label>Lịch đăng</label>
            <div className="custom-input-with-icon">
              <span className="input-icon">📅</span>
              <input type="text" className="panel-input" placeholder="Chọn ngày và giờ (không bắt buộc)" />
            </div>
          </div>
        </div>


        {/* Cover Image */}
        <div className="panel-section">
          <label>Ảnh bìa chương</label>
          <div className="cover-upload-area">
            <img
              src="https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              alt="Cover"
              className="chapter-cover-preview"
            />
            <div className="cover-upload-btn">
              <FiImage />
              Thay đổi ảnh
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="panel-section">
          <label>Thiết lập khác</label>
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span className="checkmark"></span>
              Cho phép bình luận
            </label>
            <label className="checkbox-label">
              <input type="checkbox" defaultChecked />
              <span className="checkmark"></span>
              Yêu cầu VIP/Trả phí
            </label>
            <label className="checkbox-label">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Ẩn chương
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default StudioRightPanel;
