import React from "react";

import "./Component.css";

const Label = ({ caption, value, children }) => {
  return (
    <div className="label-container">
      <div className="label-caption">{caption}</div>
      {value ? (
        <div className="label-value">{value}</div>
      ) : (
        <div className="label-value">{children}</div>
      )}
    </div>
  );
};

export default Label;
