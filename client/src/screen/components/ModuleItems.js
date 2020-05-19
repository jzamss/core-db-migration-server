import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import ModuleIcon from "@material-ui/icons/ViewModule";

import ListItemLink from "../../components/ListItemLink";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

const ModuleItems = ({ modules }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List component="nav">
        {modules.map((module) => (
          <ListItemLink
            key={module.name}
            primary={module.name}
            icon={<ModuleIcon color="primary" fontSize="large" />}
            to={{ pathname: `/modules/${module.name}`, state: { module } }}
          />
        ))}
      </List>
    </div>
  );
};

export default ModuleItems;
