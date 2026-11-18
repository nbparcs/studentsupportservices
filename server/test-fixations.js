
const { poolPromise, sql } = require("./db");

const {
  detectFixations,
  DEFAULTS
} = require("./fixations");

async function test() {
  const pool = await poolPromise;

  const result = await pool.request()
    .input("sessionId", sql.Int, 11058)
    .query(`
      SELECT
        page,
        x,
        y,
        timestamp_ms,
        aoi
      FROM dbo.GazeSamples
      WHERE session_id = @sessionId
        AND page IS NOT NULL
        AND page NOT LIKE '%/task/%'
        AND x >= 0
        AND y >= 0
      ORDER BY timestamp_ms
    `);

  console.log("Retrieved samples:", result.recordset.length);

  const samples = result.recordset.map(row => ({
    ...row,
    timestamp_ms: Number(row.timestamp_ms)
  }));

  const fixations = detectFixations(samples, DEFAULTS);

  console.log("Detected fixations:", fixations.length);
  console.table(fixations.slice(0, 10));

  await pool.close();
}

test().catch(error => {
  console.error("Test failed:", error);
  process.exitCode = 1;
});
