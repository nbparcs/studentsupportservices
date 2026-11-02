import { useState } from "react";

function EyeTrackerToggle() {
  const [showTracker, setShowTracker] = useState(true);

  const handleToggle = () => {
    const nextVisibility = !showTracker;

    setShowTracker(nextVisibility);

    if (window.webgazer) {
      window.webgazer.showVideo(nextVisibility);
      window.webgazer.showFaceOverlay(nextVisibility);
      window.webgazer.showPredictionPoints(nextVisibility);
    }
  };

  return (
    <button type="button" className="eye-toggle-btn" onClick={handleToggle}>
      {showTracker ? "Hide Eye Tracker" : "Show Eye Tracker"}
    </button>
  );
}

export default EyeTrackerToggle;
