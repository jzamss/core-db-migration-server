import React from "react";

const Content = ({ title, children, ActionComponent }) => {
  return (
    <div>
      <div className="content-container">
        <div className="content-title-container">
          <div className="content-title">{title}</div>
          {ActionComponent}
        </div>
        {children}
      </div>
    </div>
  );
};

export default Content;
