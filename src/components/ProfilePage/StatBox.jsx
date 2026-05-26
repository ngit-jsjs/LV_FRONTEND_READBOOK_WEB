import React from 'react';

function StatBox({ icon, iconColor, num, label, trend, trendType }) {
  return (
    <div className="stat-box">
      <div className={`stat-box-icon ${iconColor}`}>{icon}</div>
      <div className="stat-box-info">
        <div className="stat-box-num">{num}</div>
        <div className="stat-box-label">{label}</div>
      </div>
      {trend && (
        <div className={`stat-box-trend ${trendType}`}>
          {trend}
        </div>
      )}
    </div>
  );
}

export default StatBox;
