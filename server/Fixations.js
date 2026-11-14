// Fixation detection (I-DT) for samples stored in dbo.GazeSamples.
// Results go to dbo.GazeFixations; raw samples are never modified.
const { poolPromise, sql } = require("./db");

const DEFAULTS = { minDur: 100, maxDisp: 120, maxGap: 300 };
const INSERT_BATCH = 500;

// A fixation is a run of samples lasting at least minDur ms whose dispersion
// ((maxX - minX) + (maxY - minY)) stays within maxDisp px. Samples more than
// maxGap ms apart are never part of the same fixation.
function detectFixations(samples, opts = {}) {
  const { minDur, maxDisp, maxGap } = { ...DEFAULTS, ...opts };

  const sorted = [...samples].sort((a, b) => a.timestamp_ms - b.timestamp_ms);

  // Fixations never span a page change.
  const segments = [];
  for (const s of sorted) {
    const last = segments[segments.length - 1];
    if (last && last[0].page === s.page) last.push(s);
    else segments.push([s]);
  }

  const fixations = [];

  for (const seg of segments) {
    const t = (k) => seg[k].timestamp_ms;

    const dispersion = (a, b) => {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (let k = a; k <= b; k++) {
        const { x, y } = seg[k];
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
      return maxX - minX + (maxY - minY);
    };

    let i = 0;
    while (i < seg.length) {
      // Initial window of at least minDur ms.
      let j = i;
      while (j < seg.length - 1 && t(j) - t(i) < minDur && t(j + 1) - t(j) <= maxGap) j++;

      if (t(j) - t(i) < minDur || dispersion(i, j) > maxDisp) {
        i++;
        continue;
      }

      // Grow the window while it stays compact.
      while (j < seg.length - 1 && t(j + 1) - t(j) <= maxGap && dispersion(i, j + 1) <= maxDisp) j++;

      const win = seg.slice(i, j + 1);
      const counts = new Map();
      for (const s of win) {
        const name = s.aoi ?? "Outside AOI";
        counts.set(name, (counts.get(name) || 0) + 1);
      }
      const aoi = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];

      fixations.push({
        page: seg[i].page,
        startMs: t(i),
        endMs: t(j),
        durationMs: t(j) - t(i),
        x: win.reduce((sum, s) => sum + s.x, 0) / win.length,
        y: win.reduce((sum, s) => sum + s.y, 0) / win.length,
        nSamples: win.length,
        aoi,
      });

      i = j + 1;
    }
  }

  return fixations;
}

// Re-computes all fixations for one session and replaces any existing ones,
// so it is safe to call repeatedly (e.g. with different thresholds).
async function computeAndSaveFixations(sessionId, opts = {}) {
  const params = { ...DEFAULTS, ...opts };
  const pool = await poolPromise;

  // Instruction screens (/task/N) and off-screen estimates are excluded.
  const { recordset } = await pool
    .request()
    .input("sessionId", sql.Int, sessionId)
    .query(`
      SELECT task_code, interface_name, page, x, y, timestamp_ms, aoi
      FROM dbo.GazeSamples
      WHERE session_id = @sessionId
        AND page NOT LIKE '%/task/%'
        AND x >= 0 AND y >= 0
    `);

  // Group by interface + task. task_code may be "1" or "Task 1 - ...", so keep the number.
  const groups = new Map();
  for (const row of recordset) {
    const taskCode = String(row.task_code).match(/\d+/)?.[0];
    if (!taskCode) continue;

    const key = `${row.interface_name}|${taskCode}`;
    if (!groups.has(key)) {
      groups.set(key, { interfaceName: row.interface_name, taskCode, samples: [] });
    }
    // BIGINT comes back from the driver as a string.
    groups.get(key).samples.push({ ...row, timestamp_ms: Number(row.timestamp_ms) });
  }

  const rows = [];
  for (const g of groups.values()) {
    for (const f of detectFixations(g.samples, params)) {
      rows.push({ taskCode: g.taskCode, interfaceName: g.interfaceName, ...f });
    }
  }

  const tx = new sql.Transaction(pool);
  await tx.begin();

  try {
    await new sql.Request(tx)
      .input("sessionId", sql.Int, sessionId)
      .query("DELETE FROM dbo.GazeFixations WHERE session_id = @sessionId");

    for (let i = 0; i < rows.length; i += INSERT_BATCH) {
      await new sql.Request(tx)
        .input("sessionId", sql.Int, sessionId)
        .input("minDur", sql.Int, params.minDur)
        .input("maxDisp", sql.Int, params.maxDisp)
        .input("maxGap", sql.Int, params.maxGap)
        .input("fixations", sql.NVarChar(sql.MAX), JSON.stringify(rows.slice(i, i + INSERT_BATCH)))
        .query(`
          INSERT INTO dbo.GazeFixations (
            session_id, task_code, interface_name, page,
            start_ms, end_ms, duration_ms, x, y, n_samples, aoi,
            min_dur_ms, max_disp_px, max_gap_ms
          )
          SELECT
            @sessionId, task_code, interface_name, page,
            start_ms, end_ms, duration_ms, x, y, n_samples, aoi,
            @minDur, @maxDisp, @maxGap
          FROM OPENJSON(@fixations)
          WITH (
            task_code NVARCHAR(50) '$.taskCode',
            interface_name NVARCHAR(30) '$.interfaceName',
            page NVARCHAR(500) '$.page',
            start_ms BIGINT '$.startMs',
            end_ms BIGINT '$.endMs',
            duration_ms INT '$.durationMs',
            x FLOAT '$.x',
            y FLOAT '$.y',
            n_samples INT '$.nSamples',
            aoi NVARCHAR(200) '$.aoi'
          );
        `);
    }

    await tx.commit();
  } catch (error) {
    await tx.rollback();
    throw error;
  }

  return { fixationCount: rows.length, thresholds: params };
}

module.exports = { detectFixations, computeAndSaveFixations, DEFAULTS };