
export function calculateFixations(gazeData, options = {}) {
  const {
    minimumDuration = 100,
    dispersionThreshold = 100,
  } = options;

  if (!Array.isArray(gazeData) || gazeData.length === 0) {
    return {
      fixations: [],
      fixationCount: 0,
      totalFixationDuration: 0,
      meanFixationDuration: 0,
    };
  }

  // Keep valid gaze samples and sort them by timestamp.
  const samples = gazeData
    .filter(
      (point) =>
        Number.isFinite(Number(point.x)) &&
        Number.isFinite(Number(point.y)) &&
        Number.isFinite(Number(point.timestamp))
    )
    .sort((a, b) => Number(a.timestamp) - Number(b.timestamp));

  const fixations = [];

  // Do not combine samples from different pages or interfaces.
  const groups = [];

  samples.forEach((sample) => {
    const previous = groups[groups.length - 1];

    if (
      !previous ||
      previous[0].page !== sample.page ||
      previous[0].interface !== sample.interface
    ) {
      groups.push([sample]);
    } else {
      previous.push(sample);
    }
  });

  function getDispersion(points) {
    const xs = points.map((p) => Number(p.x));
    const ys = points.map((p) => Number(p.y));

    return (
      Math.max(...xs) - Math.min(...xs) +
      Math.max(...ys) - Math.min(...ys)
    );
  }

  groups.forEach((group) => {
    let start = 0;

    while (start < group.length) {
      let end = start;

      // Expand until the minimum duration is reached.
      while (
        end < group.length - 1 &&
        Number(group[end].timestamp) -
          Number(group[start].timestamp) < minimumDuration
      ) {
        end++;
      }

      const window = group.slice(start, end + 1);

      if (
        window.length < 2 ||
        Number(window[window.length - 1].timestamp) -
          Number(window[0].timestamp) < minimumDuration ||
        getDispersion(window) > dispersionThreshold
      ) {
        start++;
        continue;
      }

      // Expand the fixation while dispersion remains acceptable.
      while (end + 1 < group.length) {
        const expandedWindow = group.slice(start, end + 2);

        if (getDispersion(expandedWindow) > dispersionThreshold) {
          break;
        }

        end++;
      }

      const fixationSamples = group.slice(start, end + 1);
      const first = fixationSamples[0];
      const last = fixationSamples[fixationSamples.length - 1];

      const duration =
        Number(last.timestamp) - Number(first.timestamp);

      const averageX =
        fixationSamples.reduce((sum, p) => sum + Number(p.x), 0) /
        fixationSamples.length;

      const averageY =
        fixationSamples.reduce((sum, p) => sum + Number(p.y), 0) /
        fixationSamples.length;

      // Use the most frequently recorded AOI within the fixation.
      const aoiCounts = {};

      fixationSamples.forEach((point) => {
        if (point.aoi) {
          aoiCounts[point.aoi] = (aoiCounts[point.aoi] || 0) + 1;
        }
      });

      const dominantAOI =
        Object.entries(aoiCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
        null;

      fixations.push({
        interface: first.interface,
        page: first.page,
        startTime: Number(first.timestamp),
        endTime: Number(last.timestamp),
        duration,
        x: averageX,
        y: averageY,
        aoi: dominantAOI,
        sampleCount: fixationSamples.length,
      });

      start = end + 1;
    }
  });

  const totalFixationDuration = fixations.reduce(
    (sum, fixation) => sum + fixation.duration,
    0
  );

  return {
    fixations,
    fixationCount: fixations.length,
    totalFixationDuration,
    meanFixationDuration:
      fixations.length > 0
        ? totalFixationDuration / fixations.length
        : 0,
  };
}


export function calculateAOIAttention(gazeData){

    const attention = {};


    gazeData.forEach(point=>{

        const aoi = point.aoi;


        if(!attention[aoi]){
            attention[aoi]=0;
        }


        attention[aoi]++;

    });


    return attention;

}



export function calculateViewingTime(gazeData){

    const viewingTime={};


    for(let i=1;i<gazeData.length;i++){

        const previous = gazeData[i-1];

        const current = gazeData[i];


        const duration =
            current.timestamp - previous.timestamp;


        const aoi=current.aoi;


        if(!viewingTime[aoi]){
            viewingTime[aoi]=0;
        }


        viewingTime[aoi]+=duration;

    }
    return viewingTime;

}



export function getGazePath(gazeData){

    const path=[];


    gazeData.forEach(point=>{


        if(
            path[path.length-1] !== point.aoi
        ){

            path.push(point.aoi);

        }

    });


    return path;

}