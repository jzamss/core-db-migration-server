import React, { useState, useEffect } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import Toolbar from "@material-ui/core/Toolbar";
import RefreshIcon from "@material-ui/icons/Refresh";

import Page from "../components/Page";
import Content from "../components/Content";
import Action from "../components/Action";
import Error from "../components/Error";

import ModuleItem from "./components/ModuleItem";

import * as api from "../api";

const HomeScreen = (props) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const getModules = async () => {
    const modules = await api.getModules();
    setModules(modules);
  };

  const buildModules = async () => {
    try {
      const modules = await api.buildModules();
      setModules(modules);
    } catch (err) {
      setError(err);
    }
  };

  const buildModulesHandler = () => {
    setError(null);
    setLoading(true);
    buildModules().then(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    try {
      getModules();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const Actions = (
    <Toolbar variant="dense">
      <Action
        color="primary"
        onClick={buildModulesHandler}
        Icon={RefreshIcon}
      />
    </Toolbar>
  );

  return (
    <Page>
      <Content title="Modules" ActionComponents={Actions}>
        <Error text={error} />
        {loading && <LinearProgress color="secondary" />}
        <Error text={modules.length === 0 ? "No available modules." : null} />
        {modules.map((mod) => (
          <ModuleItem key={mod.name} module={mod} />
        ))}
      </Content>
    </Page>
  );
};

export default HomeScreen;
