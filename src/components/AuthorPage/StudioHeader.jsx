import React from 'react';
import { Link } from 'react-router-dom';
import { MdMenuBook } from 'react-icons/md';
import { FiEye, FiSave, FiSend, FiMenu, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';


function StudioHeader({ toggleSidebar, toggleRightPanel }) {
  const { user } = useAuth();

  return (
    <header className="studio-header">
      {/* Logo & Breadcrumb */}
      <div className="studio-header-left">
        <button className="icon-btn sidebar-toggle-btn" onClick={toggleSidebar}>
          <FiMenu />
        </button>
        <div className="studio-breadcrumb">
          <span>Viết truyện</span>
          <span className="separator">/</span>
          <span className="current-story">Ký Ức Ngàn Sao </span>
        </div>
      </div>

      {/* Actions */}
      <div className="studio-header-right">


        <button className="btn-preview">
          <FiEye /> Xem trước
        </button>



        <button className="btn-draft">
          <FiSave /> Lưu bản nháp
        </button>

        <div className="publish-group">
          <button className="btn-publish">
            <FiSend /> Xuất bản
          </button>
          <button className="btn-publish-dropdown">▼</button>
        </div>

        <button className="btn-preview" onClick={toggleRightPanel}>
          <FiSettings /> Cài đặt chương
        </button>

      </div>
    </header>
  );
}

export default StudioHeader;
