import React from "react";
import { Link  } from "react-router-dom";

const Module = ({module}) => {
  return <div className="module-container">
    <div className="module-image"></div>
    <div className="module-title">
      <Link to={{
        pathname: `/modules/${module.name}`,
        state: { module },
      }}>
        {module.name}
      </Link>
    </div>
  </div>
};

export default Module;
