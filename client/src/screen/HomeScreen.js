import React, { useState, useEffect } from "react";

import Header from "../components/Header";
import Content from "../components/Content";
import ModuleItem from "../components/ModuleItem";

import * as api from "../api";


const HomeScreen = (props) => {
  const [modules, setModules] = useState([]);

  const loadModules = async () => {
    const modules = await api.getModules();
    setModules(modules);
  }

  useEffect(() => {
    try {
      loadModules();
    } catch (err) {
      console.log(err)
    }
  }, []);

  return (
    <div>
      <Header />
      <Content title="Modules">
        {modules.map((mod) => {
          return <ModuleItem module={mod} />;
        })}
      </Content>
    </div>
  );
};

export default HomeScreen;
