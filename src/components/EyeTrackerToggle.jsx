import { useState } from "react";
import EyeTracker from "../pages/baseline/EyeTracker";

function EyeTrackerToggle() {
  const [showTracker, setShowTracker] = useState(false);

  return (
    <>
      <button
        className="eye-toggle-btn"
        onClick={() => setShowTracker((previous) => !previous)}
      >
        {showTracker ? "Hide Eye Tracker" : "Show Eye Tracker"}
      </button>

      {/* DO NOT REMOVE COMPONENT */}
      {/* only hide WebGazer UI */}
      <EyeTracker visible={showTracker} />
    </>
  );
}

export default EyeTrackerToggle;
