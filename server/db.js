const sql = require("mssql/msnodesqlv8");

const config = {
  connectionString:
    "Driver={ODBC Driver 17 for SQL Server};" +
    "Server=(localdb)\\MSSQLLocalDB;" +
    "Database=StudentSupportResearch;" +
    "Trusted_Connection=Yes;",
  options: {
    trustedConnection: true,
    trustServerCertificate: true,
  },
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

