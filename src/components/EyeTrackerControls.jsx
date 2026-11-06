import { useState, useEffect } from "react";
import { Minimize2, Maximize2 } from "lucide-react";

function EyeTrackerControls() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const container = document.getElementById("webgazerVideoContainer");

    if (!container) return;

    if (collapsed) {
      container.style.setProperty("width", "300px", "important");
      container.style.setProperty("height", "0px", "important");
      container.style.setProperty("overflow", "hidden", "important");
    } else {
      container.style.setProperty("width", "300px", "important");
      container.style.setProperty("height", "225px", "important");
      container.style.setProperty("overflow", "hidden", "important");
    }
  }, [collapsed]);

  return (
    <button
      className="eye-collapse-btn"
      onClick={() => setCollapsed(!collapsed)}
    >
      {collapsed ? <Maximize2 /> : <Minimize2 />}
      {collapsed ? "Show Camera" : "Hide Camera"}
    </button>
  );
}

export default EyeTrackerControls;
