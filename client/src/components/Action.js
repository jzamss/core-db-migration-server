import React from "react";
import IconButton from "@material-ui/core/IconButton";


const Action = ({color, onClick, Icon}) => {
  return (
    <IconButton color={color} onClick={onClick}>
      <Icon />
    </IconButton>
  );
};

export default Action;
