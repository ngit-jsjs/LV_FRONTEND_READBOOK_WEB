import React, { useState } from 'react';
import { FiBook, FiSettings, FiPlus, FiChevronDown, FiChevronRight, FiCheck } from 'react-icons/fi';
import './StudioSidebar.css';

function StudioSidebar() {
  const [expandedArcs, setExpandedArcs] = useState({
    arc1: true,
    arc2: false,
    arc3: false
  });
  const [showChapters, setShowChapters] = useState(true);

  const toggleArc = (arc) => {
    setExpandedArcs(prev => ({ ...prev, [arc]: !prev[arc] }));
  };

  return (
    <aside className="studio-sidebar">
      {/* Story Info */}
      <div className="sidebar-story-info">
        <div className="story-cover-row">
          <img 
            src="https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
            alt="Ký Ức Ngàn Sao" 
            className="story-cover"
          />
          <div className="story-details">
            <h3 className="story-title">Ký Ức Ngàn Sao <span>✎</span></h3>
            <div className="story-status">
              <span className="status-dot published"></span> Đã xuất bản
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
          <h4>Danh sách chương</h4>
          <button className="btn-new-chapter">
            <FiPlus /> Chương mới
          </button>
        </div>

        <div className="arc-list">
          {/* Arc 1 */}
          <div className="arc-item">
            <div className="arc-header" onClick={() => toggleArc('arc1')}>
              {expandedArcs.arc1 ? <FiChevronDown className="arc-toggle" /> : <FiChevronRight className="arc-toggle" />}
              <span className="arc-title">Arc 1: Khởi Đầu</span>
              <FiChevronRight className="arc-arrow" />
            </div>
            
            {expandedArcs.arc1 && (
              <div className="arc-chapters">
                <div className="chapter-item">
                  <span className="chapter-dot"></span>
                  <span className="chapter-name">Chương 1: Gặp gỡ</span>
                  <FiCheck className="chapter-status-icon published" />
                </div>
                <div className="chapter-item">
                  <span className="chapter-dot"></span>
                  <span className="chapter-name">Chương 2: Lời hứa</span>
                </div>
                <div className="chapter-item">
                  <span className="chapter-dot"></span>
                  <span className="chapter-name">Chương 3: Biến cố</span>
                  <FiCheck className="chapter-status-icon published" />
                </div>
                <div className="chapter-item">
                  <span className="chapter-dot"></span>
                  <span className="chapter-name">Chương 4: Bóng tối</span>
                </div>
                <div className="chapter-item active">
                  <span className="chapter-dot"></span>
                  <span className="chapter-name">Chương 5: Ánh Sao Rơi</span>
                </div>
              </div>
            )}
          </div>

          {/* Arc 2 */}
          <div className="arc-item">
            <div className="arc-header" onClick={() => toggleArc('arc2')}>
              {expandedArcs.arc2 ? <FiChevronDown className="arc-toggle" /> : <FiChevronRight className="arc-toggle" />}
              <span className="arc-title">Arc 2: Hành Trình</span>
              <span className="arc-count">16</span>
            </div>
          </div>

          {/* Arc 3 */}
          <div className="arc-item">
            <div className="arc-header" onClick={() => toggleArc('arc3')}>
              {expandedArcs.arc3 ? <FiChevronDown className="arc-toggle" /> : <FiChevronRight className="arc-toggle" />}
              <span className="arc-title">Arc 3: Sự Thật</span>
              <span className="arc-count">21</span>
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
