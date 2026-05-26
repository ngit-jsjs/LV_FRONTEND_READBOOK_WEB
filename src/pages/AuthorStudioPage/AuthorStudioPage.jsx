import React, { useState } from 'react';
import StudioHeader from '../../components/AuthorPage/StudioHeader';
import StudioSidebar from '../../components/AuthorPage/StudioSidebar';
import StudioEditor from '../../components/AuthorPage/StudioEditor';
import StudioRightPanel from '../../components/AuthorPage/StudioRightPanel';
import './AuthorStudioPage.css';

function AuthorStudioPage() {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(false);

  return (
    <div className={`studio-page ${isFocusMode ? 'focus-mode' : ''}`}>
      {/* Top Header */}
      {!isFocusMode && <StudioHeader
        toggleSidebar={() => setShowSidebar(!showSidebar)}
        toggleRightPanel={() => setShowRightPanel(!showRightPanel)}
      />}

      {/* 3-Column Layout */}
      <div className="studio-workspace">
        {!isFocusMode && showSidebar && <StudioSidebar />}
        <StudioEditor isFocusMode={isFocusMode} setIsFocusMode={setIsFocusMode} />
        {!isFocusMode && showRightPanel && <StudioRightPanel />}
      </div>
    </div>
  );
}

export default AuthorStudioPage;
