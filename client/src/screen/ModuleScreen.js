import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

import Page from "../components/Page";
import Action from "../components/Action";
import Content from "../components/Content";
import Separator from "../components/Separator";
import Error from "../components/Error";

import ModuleInfo from "./components/ModuleInfo";
import ModuleFileTable from "./components/ModuleFileTable";

import * as api from "../api";
import { CircularProgress } from "@material-ui/core";

const ModuleScreen = (props) => {
  const initialModule = useLocation().state.module;
  const [module, setModule] = useState(initialModule);
  const [moduleFiles, setModuleFiles] = useState([]);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState();

  const loadFiles = useCallback(async () => {
    const moduleFiles = await api.getModuleFiles(module);
    setModuleFiles(moduleFiles);
  }, [module]);

  useEffect(() => {
    try {
      loadFiles();
    } catch (err) {
      console.log(err);
    }
  }, []);

  let history = useHistory();
  const editHandler = () => {
    history.push({
      pathname: `/module/edit/${module.name}`,
      state: { module },
    });
  };

  const deployFiles = async () => {
    try {
      await api.buildModule(module);
      await loadFiles();
    } catch (err) {
      setError(err);
    }
  };

  const deployFilesHandler = () => {
    setError(null);
    setDeploying(true);
    deployFiles().then(() => {
      setDeploying(false);
    });
  };

  const ModuleActions = (
    <Toolbar variant="dense">
      <Action color="primary" onClick={editHandler} Icon={EditIcon} />
    </Toolbar>
  );

  let hasUnprocessedFile = false;
  moduleFiles.forEach((moduleFile) => {
    moduleFile.files.forEach((file) => {
      if (file.state === 0) {
        hasUnprocessedFile = true;
      }
    });
  });

  let fileActions;
  if (hasUnprocessedFile) {
    fileActions = (
      <Toolbar>
        <Button
          variant="contained"
          color="primary"
          onClick={deployFilesHandler}
          disabled={deploying}
        >
          Deploy Files
        </Button>
        {deploying && <CircularProgress color="secondary" size={20} />}
        <Error text={error} />
      </Toolbar>
    );
  }

  return (
    <Page>
      <Content
        title={`Module: ${module.name}`}
        ActionComponents={ModuleActions}
      >
        <ModuleInfo module={module} />
        {fileActions}
        <ModuleFileTable
          files={moduleFiles}
          onDeploy={deployFilesHandler}
          deploying={deploying}
        />
      </Content>
    </Page>
  );
};

export default ModuleScreen;
