const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");

const config = require('./config/config.js');

const app = express();
const http = require("http").createServer(app);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* client */
app.use(express.static(path.join(__dirname, "client/build")));

/* migration routes */
const migration = require("./routes/migration");
app.use("/migration", migration);

/* load migration modules */
const api = require('./api/rameses-db-migration');
api.loadModules();


const port = global.gConfig.node_port

http.listen(port, err => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server listening on port ${port}`);
  }
});

