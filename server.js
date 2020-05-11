const path = require("path");
const express = require("express");

const config = require('./config/config.js');

const app = express();
const http = require("http").createServer(app);
const migration = require('./api/rameses-db-migration');

const port = global.gConfig.node_port

app.use(express.static(path.join(__dirname, "client/build")));

app.get("/api/files", async (req, res) => {
  const files = await migration.getModuleFiles("waterworks2");
  res.json(files);
});

// const waterworks = {
//   name: "waterworks2",
//   dbname: "waterworks",
//   conf: {
//     dialect: "mysql",
//     url: "jdbc:mysql://localhost:3307/waterworks",
//     user: "root",
//     pwd: "1234",
//   },
//   lastfileid: null,
// }

// const addModule = async (module) => {
//   await migration.addModule(module);
//   const mod = await migration.getModule(module.name);
// }

// addModule(waterworks);



const modules = ["waterworks2"];
// migration.loadModuleFiles(modules);

// migration.getModuleFiles("waterworks2").then(files => {
//   console.log(files);
// });


http.listen(port, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server listening on port ${port}`);
  }
});
