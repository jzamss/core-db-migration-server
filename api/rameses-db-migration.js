const path = require("path");
const { promisify } = require("util");
const redis = require("redis");
const cache = redis.createClient(global.gConfig.redis_url);

const getAsync = promisify(cache.get).bind(cache);
const setAsync = promisify(cache.set).bind(cache);
const keysAsync = promisify(cache.keys).bind(cache);

const { log, findDirs, findFiles } = require("./rameses-util");

const readData = async (key) => {
  let data = await getAsync(key);
  if (data) {
    try {
      data = JSON.parse(data);
    } catch (err) {
      log.err(`Unable to parse data for key ${key}`);
    }
  }
  return data;
};

const saveData = async (key, data) => {
  try {
    await setAsync(key, JSON.stringify(data));
  } catch (err) {
    const errMsg = `Unable to parse data for key ${key}`;
    log.err(errMsg);
    throw errMsg;
  }
};

const MODULE_KEY_PREFIX = "MODULE-";

const getModuleKey = (module) => {
  return MODULE_KEY_PREFIX + module.name;
};

const loadModules = async () => {
  const dbmRoot = global.gConfig.dbm_root;
  const dirs = findDirs(dbmRoot);
  const modules = [];
  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    const module = { name: dir.file, dbname: dir.file };
    await saveModule(module);
    modules.push(module);
  }
  return modules;
};

const saveModule = async (newModule) => {
  let module = await readData(getModuleKey(newModule));
  if (!module) {
    await saveData(getModuleKey(newModule), newModule);
    module = newModule;
  }
  log.info(`${module.name} saved.`);
  loadModuleFiles(module);
};

const updateModule = async module => {
  await saveData(getModuleKey(module), module);
  return module;
}

const getModules = async () => {
  const modules = [];
  const keys = await keysAsync(`${MODULE_KEY_PREFIX}*`);
  for (let i = 0; i < keys.length; i++) {
    const moduleJson = await getAsync(keys[i]);
    modules.push(JSON.parse(moduleJson));
  }
  modules.sort((a, b) => {
    const aname = a.name.toLowerCase();
    const bname = b.name.toLowerCase();
    if (aname < b.name) return -1;
    if (aname > b.name) return 1;
    return 0;
  })
  return modules;
};

const getModule = async (moduleName) => {
  const jsonModule = await getAsync(moduleName);
  return JSON.parse(jsonModule);
};

const isFileSaved = async (fileKey) => {
  const file = await readData(fileKey);
  return file ? true: false;
};

const saveModuleFiles = async (module, files) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const modFileKey = `${module.name}:${file.file}`;
    const fileSaved = await isFileSaved(modFileKey);
    if (!fileSaved) {
      const modFile = {
        parentid: module.name,
        filename: file.file,
        file: path.join(file.dir, file.file),
        dtfiled: new Date().toISOString(),
        errors: null,
        state: 0,
      };
      await saveData(modFileKey, modFile);
      log.info(`${module.name} file: ${modFile.filename} saved.`);
    }
  }
};

const loadModuleFiles = async (module) => {
  const dbmRoot = global.gConfig.dbm_root;
  const files = findFiles(path.join(dbmRoot, module.name));
  await saveModuleFiles(module, files);
};

const getModuleFiles = async (moduleName) => {
  const files = [];
  const keys = await keysAsync(`${moduleName}:*`);
  for (let i = 0; i < keys.length; i++) {
    files.push(await readData(keys[i]));
  }
  return files;
};

module.exports = {
  getModule,
  getModules,
  getModuleFiles,
  loadModules,
  loadModuleFiles,
  updateModule,
};
