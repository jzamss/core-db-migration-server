const path = require("path");
const config = require("./config/config");
const db = require("./api/rameses-db-migration");


const scan = async () => {
  const modules = await db.scanModules(path.join(__dirname, "test", "dbm-root","multiple"));
  modules.forEach(m => {
    console.log(m);
  })
}

scan();