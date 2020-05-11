import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit"

import Header from "../components/Header";
import Content from "../components/Content";
import ModuleInfo from "../components/ModuleInfo";
import FileTable from "../components/FileTable";

import * as api from "../api";

const ModuleScreen = (props) => {
  const initialModule = useLocation().state.module;
  const [module, setModule] = useState(initialModule);
  const [files, setFiles] = useState([]);

  const loadFiles = useCallback(async () => {
    const files = await api.getModuleFiles(module);
    setFiles(files);
  }, [module]);

  useEffect(() => {
    try {
      loadFiles();
    } catch (err) {
      console.log(err);
    }
  }, [loadFiles]);


  let history = useHistory();
  const editHandler = () => {
    history.push({
      pathname: `/module/edit/${module.name}`,
      state: { module }
    });
  }

  return (
    <div>
      <Header />
      <Content
        title={`Module: ${module.name}`}
        EditComponent={
          <IconButton color="primary" aria-label="Edit" onClick={editHandler}>
            <EditIcon />
          </IconButton>
        }
      >
        <ModuleInfo module={module} />
        <FileTable files={files} />
      </Content>
    </div>
  );
};

export default ModuleScreen;
