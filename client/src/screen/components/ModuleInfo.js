import React from "react";
import Container from "@material-ui/core/Container"

import Label from "../../components/Label";

const ModuleInfo = ({ module }) => {
  const conf = JSON.stringify(module.conf);
  return (
    <Container>
      <Label caption="Name:" width="300px" value={module.name} />
      <Label caption="Database:" value={module.dbname} />
      <Label caption="Conf (json):" value={conf} />
    </Container>
  );
};

export default ModuleInfo;
