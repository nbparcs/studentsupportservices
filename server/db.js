/*const sql = require("mssql/msnodesqlv8");

const config = {
  connectionString:
    "Driver={ODBC Driver 17 for SQL Server};" +
    "Server=(localdb)\\MSSQLLocalDB;" +
    //"Server=localhost\\SQLEXPRESS;" +
    "Database=StudentSupportResearch;" +
    "Trusted_Connection=Yes;",
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
}; */

require("dotenv").config();
const sql = require("mssql");

const config = {
  user: "supahadminzst333",
  password: "password$%App123*",
  server: "studentconnect-sql-server.database.windows.net",
  database: "StudentSupportResearch_Imported",
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
  connectionTimeout: 30000,
  requestTimeout: 30000,
}; 

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log("Connected to StudentSupportResearch!");
    return pool;
  })
  .catch((error) => {
    console.error("SQL Server connection failed:", error);
    throw error;
  });

module.exports = {
  sql,
  poolPromise,
};

