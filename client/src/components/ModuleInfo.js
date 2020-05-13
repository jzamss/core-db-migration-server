import React from "react";

import Label from "../components/Label";

const ModuleInfo = ({ module }) => {
  const conf = JSON.stringify(module.conf);
  return (
    <div className="module-info-container">
      <Label caption="Name:" value={module.name} />
      <Label caption="Database:" value={module.dbname} />
      <Label caption="Last File:" value={module.lastfileid} />
      <Label caption="Config:">
        <span>{conf}</span>
      </Label>
    </div>
  );
};

export default ModuleInfo;
