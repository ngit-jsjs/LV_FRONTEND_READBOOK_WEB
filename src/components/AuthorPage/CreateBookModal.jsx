import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiUpload, FiBook } from 'react-icons/fi';
import { ROUTES } from '../../config/routes';
import './CreateBookModal.css';

function CreateBookModal({ onClose }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call to create book
    console.log("Creating book:", formData);
    // In real app, we get the new book ID and navigate to /author/studio/:id
    // For now, just navigate to the general studio
    navigate(ROUTES.AUTHOR_STUDIO);
  };

  return (
    <div className="modal-overlay">
      <div className="create-book-modal">
        <div className="modal-header">
          <h2><FiBook /> Tạo tiểu thuyết mới</h2>
          <button className="btn-close" onClick={onClose}><FiX /></button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group flex-2">
              <label>Tên tiểu thuyết</label>
              <input 
                type="text" 
                name="title"
                placeholder="Ví dụ: Ký Ức Ngàn Sao" 
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group flex-1">
              <label>Thể loại chính</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">-- Chọn thể loại --</option>
                <option value="TienHiep">Tiên Hiệp</option>
                <option value="HuyenHuyen">Huyền Huyễn</option>
                <option value="VoNong">Võng Du</option>
                <option value="Ngontinh">Ngôn Tình</option>
                <option value="DoThi">Đô Thị</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Giới thiệu ngắn (Tóm tắt)</label>
            <textarea 
              name="description"
              placeholder="Một đoạn mô tả hấp dẫn sẽ thu hút nhiều độc giả hơn..."
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Ảnh bìa (Tùy chọn)</label>
            <div className="cover-upload-area">
              <div className="upload-placeholder">
                <FiUpload className="upload-icon" />
                <p>Kéo thả ảnh vào đây hoặc <span>Tải lên từ máy</span></p>
                <span className="upload-hint">Tỷ lệ khuyên dùng 2:3 (VD: 600x900px)</span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Hủy bỏ</button>
            <button type="submit" className="btn-submit">Tạo & Bắt đầu viết</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBookModal;
