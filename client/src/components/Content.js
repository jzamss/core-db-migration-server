import React from "react";

const Content = ({ title, children, EditComponent }) => {
  return (
    <div>
      <div className="content-container">
        <div className="content-title-container">
          <div className="content-title">{title}</div>
          {EditComponent}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Content;
