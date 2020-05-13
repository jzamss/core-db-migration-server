import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

import Header from "../components/Header";
import Content from "../components/Content";
import ModuleInfo from "../components/ModuleInfo";
import FileTable from "../components/FileTable";
import Separator from "../components/Separator";
import Error from "../components/Error";

import * as api from "../api";
import { CircularProgress } from "@material-ui/core";

const ModuleScreen = (props) => {
  const initialModule = useLocation().state.module;
  const [module, setModule] = useState(initialModule);
  const [files, setFiles] = useState([]);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState();

  const loadFiles = useCallback(async () => {
    const moduleFiles = await api.getModuleFiles(module);
    setFiles(moduleFiles);
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

  const hasUnprocessedFile = files.find((file) => file.state === 0);

  return (
    <div>
      <Header />
      <Content
        title={`Module: ${module.name}`}
        ActionComponent={
          <IconButton color="primary" aria-label="Edit" onClick={editHandler}>
            <EditIcon />
          </IconButton>
        }
      >
        <ModuleInfo module={module} />
        {hasUnprocessedFile && (
          <div className="module-actions-container">
            <Button
              variant="contained"
              color="primary"
              onClick={deployFilesHandler}
              disabled={deploying}
            >
              Deploy Files
            </Button>
            <Separator />
            {deploying && <CircularProgress color="secondary" size={20} />}
            {error && <Error text={error} />}
          </div>
        )}
        <FileTable
          files={files}
          onDeploy={deployFilesHandler}
          deploying={deploying}
        />
      </Content>
    </div>
  );
};

export default ModuleScreen;
