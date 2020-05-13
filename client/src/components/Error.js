import React from "react";

const Error = ({ text }) => {
  return (
    <div>
      <span style={{ color: "red" }}>{text}</span>
    </div>
  );
};

export default Error;
