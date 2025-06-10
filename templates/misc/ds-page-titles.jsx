import React from 'react';

const DsPageTitle = ({ title, subtitle }) => {
  return (
    <div className="upper-title-box">
      <h3>{title}</h3>
      <div className="text">{subtitle}</div>
    </div>
  );
};

export default DsPageTitle;