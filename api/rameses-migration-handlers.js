const fs = require("fs");
const mysql = require("mysql");
const mssql = require("mssql");

/*=====================================
* MYSQL Handler
=====================================*/
const mysqlHandler = (function () {
  this.pool;

  const accept = async (module, file) => {
    if (/.+\.mysql$/i.test(file.filename)) {
      await createPool(module, file);
      return true;
    }
    return false;
  };

  const createPool = async (module, file) => {
    const defaultConf = {
      connectionLimit: 10,
      host: "localhost",
      port: 3306,
      user: "root",
      password: "1234",
      database: module.dbname,
    };

    const moduleConf = module.conf[file.submodule || module.name] || {};
    const userConf = moduleConf["mysql"] || {};
    const conf = { ...defaultConf, ...userConf };

    this.pool = mysql.createPool({
      connectionLimit: conf.poolSize,
      host: conf.host,
      port: conf.port,
      user: conf.user,
      password: conf.password,
      database: conf.database,
    });
  };

  const close = async () => {
    this.pool.end((err) => {
      if (err) {
        console.log("Error closing connecton pool. ", err.stack);
        return;
      }
      console.log("Pool connections closed.");
    });
  };

  const query = (sql, values = []) => {
    return new Promise((resolve, reject) => {
      this.pool.query(
        { sql, values, timeout: this.timeout },
        (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve([results, fields]);
          }
        }
      );
    });
  };

  const execute = async (module, file, callback) => {
    const sqlFile = fs.readFileSync(file.file).toString();
    const sqls = sqlFile.split(/;$/gim);
    for (let i = 0; i < sqls.length; i++) {
      const sql = sqls[i].trim();
      if (sql.length > 0) {
        try {
          await query(sql);
          await callback("OK", file);
        } catch (err) {
          await callback(err, file);
          throw err;
        }
      }
    }
    await callback("DONE", file);
  };

  return {
    accept,
    close,
    execute,
    query,
  };
})();

/*=====================================
* MSSQL Handler
=====================================*/
const mssqlHandler = (function () {
  const accept = async (module, file) => {
    if (/.+\.mssql$/i.test(file.filename)) {
      await createConnection(module, file);
      return true;
    }
    return false;
  };

  const createConnection = async (module, file) => {
    const defaultConf = {
      host: "localhost",
      port: 1433,
      user: "sa",
      password: "12345",
      database: module.dbname,
      enableArithAbort: true,
    };

    const moduleConf = module.conf[file.submodule || module.name] || {};
    const userConf = moduleConf["mssql"] || {};
    const conf = { ...defaultConf, ...userConf };

    const { host, port, user, password, database } = conf;
    const connectionStr = `mssql://${user}:${password}@${host}:${port}/${database}`;
    await mssql.connect(connectionStr);
    console.log(`[INFO] MSSQL Server connection successfully established`);
  };

  const close = async () => {
    //
  };

  const query = async (sql, values = []) => {
    const result = await mssql.query(sql);
    const { recordsets } = result;
    return [recordsets, []];
  };

  const execute = async (module, file, callback) => {
    const sqlFile = fs.readFileSync(file.file).toString();
    const sqls = sqlFile.split(/;$/gim);
    for (let i = 0; i < sqls.length; i++) {
      const sql = sqls[i].trim();
      if (sql.length > 0) {
        try {
          await query(sql);
          await callback("OK", file);
        } catch (err) {
          await callback(err, file);
          throw err;
        }
      }
    }
    await callback("DONE", file);
  };

  return {
    accept,
    close,
    execute,
    query,
  };
})();

const handlers = [mysqlHandler, mssqlHandler];

const getHandler = async (module, file) => {
  for (let i = 0; i < handlers.length; i++) {
    const handler = handlers[i];
    const accepted = await handler.accept(module, file);
    if (accepted) {
      return handler;
    }
  }
  throw `Handler for file ${file} is not registered.`;
};

module.exports = {
  getHandler,
};
