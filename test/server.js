const path = require("path");
const fs = require("fs");
const util = require("../api/rameses-util")

const envFile = {
  file: 'env.conf',
  dir: '/home/rameses/dbm-root/waterworks/migrations'
}



console.log(util.parseEnvFile(path.join(envFile.dir, envFile.file)));