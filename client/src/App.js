import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";

const Home = (props) => {
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

const Files = (props) => {
  const [files, setFiles] = useState([]);

  const loadFiles = async() => {
    const res = await fetch("/api/files");
    const files = await res.json();
    console.log("files are", files);
    setFiles(files);
  }

  useEffect(() => {
    try {
      loadFiles();
    } catch (err) {
      console.log('ERROR', err);
    }
  }, []);

  return (
    <div>
      <h1>Files</h1>
      {files.length ? (
        files.map((file) => <div>{file.filename}</div>)
      ) : (
        <div>
          <h2>No files found.</h2>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/files">Files</Link>
          </li>
        </ul>
        <hr />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/files">
            <Files />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
