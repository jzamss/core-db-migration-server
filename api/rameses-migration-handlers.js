const fs = require("fs");
const mysql = require("mysql");

/*=====================================
* MYSQL Handler
=====================================*/
const mysqlHandler = (function () {
  this.pool;
  this.conf = {};
  this.defaultConf = {
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "1234",
    database: "",
  };
  
  const accept = async (module, file) => {
    if (/.+\.mysql$/i.test(file)) {
      const moduleConf = module.conf[file.submodule || module.name] || {};
      const userConf = moduleConf["mysql"] || {};
      this.conf = {...this.defaultConf, ...userConf};
      await createPool();
      return true;
    }
    return false;
  };

  const createPool = async () => {
    this.pool = mysql.createPool({
      connectionLimit: this.conf.poolSize,
      host: this.conf.host,
      port: this.conf.port,
      user: this.conf.user,
      password: this.conf.password,
      database: this.conf.database,
    });
  };

  const close = async () => {
    pool.end((err) => {
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
    })
  };

  const execute = async (module, file, callback) => {
    const sqlFile = fs.readFileSync(file.file).toString();
    const sqls = sqlFile.split(/;$/igm);
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
  }

  return {
    accept,
    close,
    execute,
    query,
  };
})();


const handlers = [mysqlHandler];

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
