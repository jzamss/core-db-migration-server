import React, { useEffect, useState, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import jsonFormat from "json-format";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

import Header from "../components/Header";
import Content from "../components/Content";

import * as api from "../api";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "30ch",
    },
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const formatConf = conf => {
  if (!conf) return conf;
  return jsonFormat(conf, {type: 'space', size: 2});
}

const ModuleEditScreen = (props) => {
  const initialModule = useLocation().state.module;
  const [module, setModule] = useState(initialModule);
  const [confStr, setConfStr] = useState(formatConf(initialModule.conf));
  const [confError, setConfError] = useState();

  const classes = useStyles();

  const inputChangeHandler = (evt) => {
    const { id, value } = evt.target;
    if (id === "conf") {
      try {
        setConfError(null);
        const jsonValue = JSON.parse(value);
        setModule((prevModule) => {
          return { ...prevModule, [id]: jsonValue };
        });
      } catch (err) {
        setConfError("Invalid json value.");
      }
      setConfStr(value);
    } else {
      setModule((prevModule) => {
        return { ...prevModule, [id]: value };
      });
    }
  };

  const cancelHandler = () => {
    history.replace({
      pathname: `/modules/${module.name}`,
      state: { module: initialModule },
    });
  };

  const history = useHistory();

  const submitHandler = async (event) => {
    event.preventDefault();
    await api.saveModule(module);
    history.replace({
      pathname: `/modules/${module.name}`,
      state: { module },
    });
  };

  return (
    <div>
      <Header />
      <Content title={`Module: ${module.name}`}>
        <form
          className={classes.root}
          noValidate
          autoComplete="off"
          onSubmit={submitHandler}
        >
          <div className="module-edit-form">
            <TextField
              id="name"
              label="Name"
              defaultValue={module.name}
              InputProps={{ readOnly: true }}
            />
            <TextField
              id="dbname"
              label="Database Name"
              required
              value={module.dbname}
              onChange={(event) => inputChangeHandler(event)}
            />
            <TextareaAutosize
              id="conf"
              aria-label="minimum height"
              label="Configuration"
              multiline
              rows={15}
              value={confStr}
              onChange={(event) => inputChangeHandler(event)}
            />
            {confError && (
              <span
                style={{
                  color: "red",
                  fontSize: "small",
                  marginTop: "5px",
                  marginBottom: "10px",
                }}
              >
                {confError}
              </span>
            )}
            <div className={classes.root}>
              <Button variant="contained" onClick={cancelHandler}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </div>
          </div>
        </form>
      </Content>
    </div>
  );
};

export default ModuleEditScreen;
