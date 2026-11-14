// I-DT: dispersion = (maxX - minX) + (maxY - minY)
export function detectFixations(
  samples,
  { minDur = 100, maxDisp = 120, maxGap = 300 } = {}
) {
  const data = samples
    .filter((s) => s.x >= 0 && s.y >= 0 && !String(s.page).includes("/task/"))
    .sort((a, b) => a.timestamp - b.timestamp);

  // Split into runs on the same page: fixations never span a page change.
  const segments = [];
  for (const s of data) {
    const last = segments[segments.length - 1];
    if (last && last[0].page === s.page) last.push(s);
    else segments.push([s]);
  }

  const disp = (seg, a, b) => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (let k = a; k <= b; k++) {
      minX = Math.min(minX, seg[k].x); maxX = Math.max(maxX, seg[k].x);
      minY = Math.min(minY, seg[k].y); maxY = Math.max(maxY, seg[k].y);
    }
    return maxX - minX + (maxY - minY);
  };

  const fixations = [];

  for (const seg of segments) {
    const t = (k) => seg[k].timestamp;
    let i = 0;

    while (i < seg.length) {
      let j = i;
      while (j < seg.length - 1 && t(j) - t(i) < minDur && t(j + 1) - t(j) <= maxGap) j++;

      if (t(j) - t(i) < minDur || disp(seg, i, j) > maxDisp) {
        i++;
        continue;
      }

      while (j < seg.length - 1 && t(j + 1) - t(j) <= maxGap && disp(seg, i, j + 1) <= maxDisp) j++;

      const win = seg.slice(i, j + 1);
      const counts = {};
      for (const s of win) counts[s.aoi] = (counts[s.aoi] || 0) + 1;
      const aoi = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

      fixations.push({
        page: seg[i].page,
        startMs: t(i),
        endMs: t(j),
        durationMs: t(j) - t(i),
        x: win.reduce((sum, s) => sum + s.x, 0) / win.length,
        y: win.reduce((sum, s) => sum + s.y, 0) / win.length,
        nSamples: win.length,
        aoi, // most common AOI among the samples
      });

      i = j + 1;
    }
  }

  return fixations;
}