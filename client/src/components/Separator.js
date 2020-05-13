import React from "react";

const Separator = ({width}) => {
  const actualWidth = width || 10;
  return <div style={{width: `${actualWidth}px`}}></div>;
};

export default Separator;
