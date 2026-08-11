export function setWebGazerVisibility(show) {
  const elements = [
    "webgazerVideoContainer",
    "webgazerFaceOverlay",
    "webgazerVideoFeed",
    "webgazerVideoCanvas",
  ];

  elements.forEach((id) => {
    const element = document.getElementById(id);

    if (element) {
      element.style.display = show ? "block" : "none";
    }
  });


  // Hide prediction dots
  const predictionPoints =
    document.querySelectorAll(".webgazerGazeDot");

  predictionPoints.forEach((point) => {
    point.style.display = show ? "block" : "none";
  });
}