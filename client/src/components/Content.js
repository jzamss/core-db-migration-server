import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  root: {
    alignContent: "center",
    margin: "10px",
  },
  title: {
    fontSize: "1.25rem",
  },
}));

const Content = ({ title, children, ActionComponents }) => {
  const classes = useStyles();
  return (
    <>
      <CssBaseline />
      <Container className={classes.root}>
        <Container maxWidth="lg">
          <div className="content-title-container">
            <Typography className={classes.title}>{title}</Typography>
            {ActionComponents}
          </div>
          {children}
        </Container>
      </Container>
    </>
  );
};

export default Content;
