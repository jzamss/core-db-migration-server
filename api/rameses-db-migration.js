const path = require("path");
const { promisify } = require("util");
const redis = require("redis");

const cache = redis.createClient(global.gConfig.redis_url);
const getAsync = promisify(cache.get).bind(cache);
const setAsync = promisify(cache.set).bind(cache);
const keysAsync = promisify(cache.keys).bind(cache);

const { getHandler } = require("./rameses-migration-handlers");
const { log, scanFiles } = require("./rameses-util");

const closeCache = () => {
  cache.end();
}

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

const buildModules = async () => {
  const dbmRoot = global.gConfig.dbm_root;
  const dirs = findDirs(dbmRoot);
  const modules = [];
  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    const module = {
      name: dir.file,
      dbname: dir.file,
      conf: {
        mysql: {
          host: "localhost",
          port: 3306,
          user: "root",
          password: "1234",
          database: "",
        }
      },
      lastfileid: null,
    };
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

const updateModule = async (module) => {
  await saveData(getModuleKey(module), module);
  return module;
};

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
  });
  return modules;
};

const getModule = async (moduleName) => {
  const jsonModule = await getAsync(getModuleKey({ name: moduleName }));
  let module;
  if (jsonModule) {
    module = JSON.parse(jsonModule);
  }
  return module;
};

const isFileSaved = async (fileKey) => {
  const file = await readData(fileKey);
  return file ? true : false;
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

const updateFile = async (module, file) => {
  const modFileKey = `${module.name}:${file.filename}`;
  await saveData(modFileKey, file);
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
  files.sort((a, b) => {
    const afile = a.filename;
    const bfile = b.filename;
    if (afile < bfile) return -1;
    if (afile > bfile) return 1;
    return 0;
  });
  return files;
};

const buildModule = async (moduleName) => {
  log.info(`Building module ${moduleName}`);
  const module = await getModule(moduleName);
  if (!module) {
    throw `Module ${moduleName} is not registered. Try adding or reloading migration service.`;
  }
  const files = await getModuleFiles(moduleName);
  const unprocessedFiles = files.filter((file) => file.state === 0);
  for (let i = 0; i < unprocessedFiles.length; i++) {
    try {
      const file = unprocessedFiles[i];
      const handler = await getHandler(module, file.filename);
      log.info(`Processing file ${file.filename}`);
      await handler.execute(module, file, async (status, file) => {
        if (status === "OK") {
          module.lastfileid = file.filename;
          await updateModule(module);
        } else if (status === "DONE") {
          module.lastfileid = file.filename;
          await updateModule(module);
          file.state = 1;
          await updateFile(module, file);
        } else {
          file.errors = status.sqlMessage;
          file.state = 1;
          updateFile(module, file);
        }
      });
      await handler.close();
    } catch (err) {
      log.err(err);
    }
  }
};

const initModule = (parent, dir, file) => {
  return {
    dir,
    file: file.name,
    fileId: parent ? `${parent.file}.${file.name}` : file.name,
    files: [],
    modules: [],
  }
}

const initFile = (dir, file) => {
  return { file: file.name, dir }
}

const scanModuleFiles = async (dir, parent) => {
  const files = await scanFiles(dir);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.isDirectory() ) {
      let parentDir;
      if (/migrations/i.test(file.name)) {
        parentDir = path.join(dir, "migrations");
        await scanModuleFiles(parentDir, parent);
      } else {
        const module = initModule(parent, dir, file);
        parent.modules.push(module);
        parentDir = path.join(dir, file.name)
        await scanModuleFiles(parentDir, module);
      }
    } else {
      parent.files.push(initFile(dir, file));
    }
  };
}

const scanModules = async (dir) => {
  const modules = [];
  const files = await scanFiles(dir);
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.isDirectory()) {
      const module = initModule(null, dir, file);
      modules.push(module);
      const parentDir = path.join(dir, file.name);
      await scanModuleFiles(parentDir, module);
    } else {
      module.files.push({
        dir: dir,
        file: file.name,
      })
    }
  };
  return modules;
};


module.exports = {
  buildModule,
  buildModules,
  getModule,
  getModules,
  getModuleFiles,
  loadModuleFiles,
  updateFile,
  updateModule,
  scanModules,
  closeCache
};
