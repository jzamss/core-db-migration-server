const path = require("path");
const { promisify } = require("util");
const redis = require("redis");
const cache = redis.createClient(global.gConfig.redis_url);

const getAsync = promisify(cache.get).bind(cache);
const setAsync = promisify(cache.set).bind(cache);
const keysAsync = promisify(cache.keys).bind(cache);
const mgetAsync = promisify(cache.mget).bind(cache);
const msetAsync = promisify(cache.mset).bind(cache);

const { findFiles } = require("./rameses-util");

const addModule = async module => {
  await setAsync(module.name, JSON.stringify(module));
}

const getModule = async moduleName => {
  const jsonModule = await getAsync(moduleName);
  return JSON.parse(jsonModule);
}

const saveModuleFiles = async (moduleName, files) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const modFile = {
      parentid: moduleName, 
      filename: file.file, 
      file: path.join(file.dir, file.file),
      dtfiled: new Date().toISOString(), 
      errors: null, 
      state: 0
    };
    const modFileKey = `${moduleName}:${file.file}`;
    await setAsync(modFileKey, JSON.stringify(modFile));
  }
  // console.log("saveModuleFiles", files);
};

const loadModuleFiles = async (moduleName) => {
  if (!moduleName) {
    return;
  }

  const dbmRoot = global.gConfig.dbm_root;
  const files = findFiles(path.join(dbmRoot, moduleName));
  await saveModuleFiles(moduleName, files);
};

const getModuleFiles = async (moduleName) => {
  const files = [];
  const keys = await keysAsync(`${moduleName}:*`);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const file = await getAsync(key);
    files.push(JSON.parse(file));
  }
  return files;
}

module.exports = {
  addModule,
  getModule,
  loadModuleFiles,
  getModuleFiles
};
