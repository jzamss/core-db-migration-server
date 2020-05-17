const sql = require("mssql");

// const run = async () => {
//   try {
//     await sql.connect("mssql://sa:12345@192.168.1.9/etracs");
//     const result = await sql.query("select * from test");
//     console.log(result);
//   } catch(err) {
//     console.log('ERROR', err);
//   }
// };


const pool = new sql.ConnectionPool({
  enableArithAbort: true,
  server: "192.168.1.9",
  port: 1433,
  user: "sa",
  password: "12345",
  database: "etracs",
});

pool.on("error", err => {
  console.log("error", err);
})

const poolConnect = pool.connect();


const run = async () => {
  await poolConnect();
  const request = await this.pool.request();
  const result = await request.query("select * from test");
  console.log("result", result);
}



run();
