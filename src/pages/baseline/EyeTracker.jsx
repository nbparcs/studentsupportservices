import { useEffect, useState, useRef, useContext } from "react";
import { useStudy } from "../../Context/StudyContext.jsx";
import { ResultsContext } from "../../Context/ResultsContext.jsx";
import { TaskContext } from "../../Context/TaskContext.jsx";
import { findAOI, updateAOIs } from "../../utils/aoiTracker.js";
import { useLocation } from "react-router-dom";

const CLICKS_PER_POINT = 5;

const points = [
  { x: "10%", y: "10%" },
  { x: "50%", y: "10%" },
  { x: "90%", y: "10%" },
  { x: "10%", y: "50%" },
  { x: "50%", y: "50%" },
  { x: "90%", y: "50%" },
  { x: "10%", y: "90%" },
  { x: "50%", y: "90%" },
  { x: "90%", y: "90%" },
];

function EyeTracker() {
  const [step, setStep] = useState(0);
  const [clicksAtPoint, setClicksAtPoint] = useState(0);
  const [gaze, setGaze] = useState(null);
  const [aoiStats, setAoiStats] = useState({});
  const [trackerError, setTrackerError] = useState("");

  const heatmapCanvasRef = useRef(null);
  const gazeDataRef = useRef([]);
  const aoiStatsRef = useRef({});

  const [showCalibrationMessage, setShowCalibrationMessage] = useState(false);

  const location = useLocation();

  const [showAOIStats, setShowAOIStats] = useState(false);

  const {
    studyData,
    hasConsented,
    isWebGazerReady,
    setIsWebGazerReady,
    isCalibrated,
    completeCalibration,
  } = useStudy();

  console.log("EyeTracker mounted/rendered", {
    isCalibrated,
    isWebGazerReady,
  });

  useEffect(() => {
    console.log("EyeTracker component mounted");

    return () => {
      console.log("EyeTracker component unmounted");
    };
  }, []);

  const { activeTask } = useContext(TaskContext);
  const activeTaskRef = useRef(activeTask);

  const { addGazeRecord } = useContext(ResultsContext);

  useEffect(() => {
    if (hasConsented && isCalibrated) {
      setShowCalibrationMessage(true);

      const timer = setTimeout(() => {
        setShowCalibrationMessage(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [hasConsented, isCalibrated]);

  /* --------------------------------
     Refresh AOIs whenever page changes
  -------------------------------- */

  useEffect(() => {
    activeTaskRef.current = activeTask;

    window.gazeCollectionEnabled = Boolean(activeTask);

    if (activeTask) {
      // Start with a clean gaze dataset for this task.
      gazeDataRef.current = [];
      aoiStatsRef.current = {};

      setAoiStats({});
      setGaze(null);

      window.debugGaze = gazeDataRef;
    }

    console.log("EyeTracker active task changed:", {
      activeTask,
      taskId: activeTask?.id ?? null,
      taskTitle: activeTask?.title ?? null,
      gazeCollectionEnabled: window.gazeCollectionEnabled,
    });
  }, [activeTask]);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateAOIs();
      setAoiStats({});
      aoiStatsRef.current = {};
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  /* --------------------------------
     Heatmap drawing
  -------------------------------- */

  useEffect(() => {
    if (!heatmapCanvasRef.current || !gaze) return;

    const canvas = heatmapCanvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = "rgba(255,0,0,0.08)";
    ctx.beginPath();
    ctx.arc(gaze.x, gaze.y, 20, 0, Math.PI * 2);
    ctx.fill();
  }, [gaze]);

  /* --------------------------------
     Start WebGazer after consent
  -------------------------------- */

  useEffect(() => {
    if (!hasConsented) return;

    if (!window.webgazer) {
      console.warn("WebGazer is not available.");
      setTrackerError(
        "Eye tracking could not be loaded. Please refresh the application.",
      );
      return;
    }

    let cancelled = false;

    // Store pending gaze samples globally.
    window.pendingGazeSamples = window.pendingGazeSamples || [];

    // Upload pending gaze samples to SQL Server.
    window.flushPendingGazeSamples = async (sessionId) => {
      if (window.gazeUploadInProgress) {
        throw new Error("A gaze upload is already in progress.");
      }

      const queue = window.pendingGazeSamples || [];

      if (queue.length === 0) {
        console.warn("No pending gaze samples to upload.");
        return { savedCount: 0 };
      }

      window.gazeUploadInProgress = true;

      let totalSaved = 0;

      try {
        while (queue.length > 0) {
          const batch = queue.slice(0, 100);

          const response = await fetch("http://localhost:3001/api/gaze/batch", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sessionId: Number(sessionId),
              samples: batch,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || "Gaze upload failed.");
          }

          if (data.savedCount !== batch.length) {
            throw new Error(
              `Expected ${batch.length} samples, but server saved ${data.savedCount}.`,
            );
          }

          // Remove samples only after successful database insertion.
          queue.splice(0, batch.length);

          totalSaved += data.savedCount;

          console.log("Gaze batch uploaded:", data.savedCount);
        }

        console.log("All gaze samples uploaded:", totalSaved);

        return { savedCount: totalSaved };
      } finally {
        window.gazeUploadInProgress = false;
      }
    };

    const startWebGazer = async () => {
      try {
        // Already running: do not initialise it again.
        if (window.webgazerStarted) {
          console.log("WebGazer already running.");

          if (!cancelled) {
            setIsWebGazerReady(true);
          }

          return;
        }

        // Reuse an initialisation already in progress.
        if (window.webgazerStarting) {
          await window.webgazerStarting;

          if (!cancelled) {
            setIsWebGazerReady(true);
          }

          return;
        }

        console.log("Starting WebGazer...");

        window.webgazerStarting = (async () => {
          await window.webgazer
            .setTracker("TFFacemesh")
            .setRegression("ridge")
            .setGazeListener((data) => {
              if (!data) return;

              const currentTask = activeTaskRef.current;

              // Only collect research gaze samples during active tasks.
              if (!window.gazeCollectionEnabled || !currentTask) {
                return;
              }

              const aoi = findAOI(data.x, data.y);
              const timestamp = Date.now();

              const currentInterface = window.location.pathname.startsWith(
                "/accessible",
              )
                ? "Accessible"
                : "Baseline";

              const gazeRecord = {
                participant: studyData.participant,
                taskCode:
                  currentTask?.id != null ? String(currentTask.id) : null,
                interface: currentInterface,
                page: window.location.pathname,
                x: data.x,
                y: data.y,
                timestamp,
                aoi,
              };

              // Store gaze data for the current task.
              gazeDataRef.current.push(gazeRecord);

              addGazeRecord(gazeRecord);

              // Queue samples for upload when Finish Task is clicked.
              window.pendingGazeSamples.push({
                taskCode: gazeRecord.taskCode,
                interface: gazeRecord.interface,
                page: gazeRecord.page,
                x: gazeRecord.x,
                y: gazeRecord.y,
                timestamp: gazeRecord.timestamp,
                aoi: gazeRecord.aoi,
              });

              /* AOI statistics */

              if (!aoiStatsRef.current[aoi]) {
                aoiStatsRef.current[aoi] = {
                  count: 0,
                  firstSeen: timestamp,
                  lastSeen: timestamp,
                  viewingTime: 0,
                };
              }

              const current = aoiStatsRef.current[aoi];

              current.count++;
              current.viewingTime += timestamp - current.lastSeen;
              current.lastSeen = timestamp;

              setAoiStats({ ...aoiStatsRef.current });

              /* Current gaze position */

              setGaze({
                x: data.x,
                y: data.y,
              });
            })
            .begin();

          // Only mark as started after begin() succeeds.
          window.webgazer.showVideo(true);
          window.webgazer.showFaceOverlay(true);
          window.webgazer.showPredictionPoints(true);

          window.webgazerStarted = true;

          console.log("WebGazer started successfully.");
        })();

        await window.webgazerStarting;

        if (!cancelled) {
          setIsWebGazerReady(true);
          setTrackerError("");
        }
      } catch (error) {
        console.error("WebGazer initialisation failed:", error);

        window.webgazerStarted = false;

        if (!cancelled) {
          setTrackerError(
            "Eye tracking could not start. Please check camera permission and refresh.",
          );
        }
      } finally {
        window.webgazerStarting = null;
      }
    };

    startWebGazer();

    return () => {
      cancelled = true;

      // Do not stop WebGazer when navigating between pages.
    };
  }, [hasConsented]);

  /* --------------------------------
   Draggable and collapsible WebGazer preview
-------------------------------- */

  useEffect(() => {
    if (!isWebGazerReady) return;

    let observer;
    let toolbar = null;
    let videoContainer = null;

    const setupVideoControls = () => {
      videoContainer = document.getElementById("webgazerVideoContainer");

      if (!videoContainer || toolbar) return;

      // Get the current position of the WebGazer container.
      const rect = videoContainer.getBoundingClientRect();

      let containerTop = rect.top;
      let containerLeft = rect.left;

      // Keep WebGazer's video preview in its own floating position.
      videoContainer.style.setProperty("position", "fixed", "important");
      videoContainer.style.setProperty("top", `${containerTop}px`, "important");
      videoContainer.style.setProperty(
        "left",
        `${containerLeft}px`,
        "important",
      );
      videoContainer.style.setProperty("right", "auto", "important");
      videoContainer.style.setProperty("bottom", "auto", "important");
      videoContainer.style.setProperty("z-index", "9000", "important");

      // Create a separate control bar.
      toolbar = document.createElement("div");

      toolbar.style.cssText = `
      position: fixed;
      top: ${containerTop - 10}px;
      left: ${containerLeft}px;
      width: 305px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #2b2ed1;
      color: white;
      border-radius: 6px 6px 0 0;
      z-index: 9001;
      box-sizing: border-box;
      padding: 0 8px;
      font-family: Arial, sans-serif;
    `;

      // Drag handle.
      const dragHandle = document.createElement("div");

      dragHandle.innerHTML = "⠿";
      dragHandle.title = "Drag to move";
      dragHandle.style.cssText = `
      cursor: grab;
      font-size: 22px;
      padding: 0 10px;
      user-select: none;
      touch-action: none;
    `;

      // Collapse / expand button.
      const toggleButton = document.createElement("button");

      toggleButton.textContent = "−";
      toggleButton.setAttribute("aria-label", "Collapse camera preview");

      toggleButton.style.cssText = `
      width: 28px;
      height: 26px;
      border: none;
      border-radius: 4px;
      background:  #fff81f;
      color: #2b2ed1;
      font-size: 20px;
      cursor: pointer;
      line-height: 1;
    `;

      let collapsed = false;

      toggleButton.addEventListener("click", () => {
        collapsed = !collapsed;

        // Hide only the preview, not WebGazer itself.
        videoContainer.style.visibility = collapsed ? "hidden" : "visible";

        toggleButton.textContent = collapsed ? "+" : "−";
        toggleButton.setAttribute(
          "aria-label",
          collapsed ? "Expand camera preview" : "Collapse camera preview",
        );
      });

      // Dragging behaviour.
      let dragging = false;
      let startX = 0;
      let startY = 0;
      let initialLeft = 0;
      let initialTop = 0;

      dragHandle.addEventListener("pointerdown", (event) => {
        dragging = true;

        startX = event.clientX;
        startY = event.clientY;

        initialLeft = containerLeft;
        initialTop = containerTop;

        dragHandle.style.cursor = "grabbing";
        dragHandle.setPointerCapture(event.pointerId);
      });

      dragHandle.addEventListener("pointermove", (event) => {
        if (!dragging) return;

        const deltaX = event.clientX - startX;
        const deltaY = event.clientY - startY;

        containerLeft = initialLeft + deltaX;
        containerTop = initialTop + deltaY;

        videoContainer.style.setProperty(
          "left",
          `${containerLeft}px`,
          "important",
        );

        videoContainer.style.setProperty(
          "top",
          `${containerTop}px`,
          "important",
        );

        toolbar.style.left = `${containerLeft}px`;
        toolbar.style.top = `${containerTop - 20}px`;
      });

      const stopDragging = () => {
        dragging = false;
        dragHandle.style.cursor = "grab";
      };

      dragHandle.addEventListener("pointerup", stopDragging);
      dragHandle.addEventListener("pointercancel", stopDragging);

      toolbar.appendChild(dragHandle);
      toolbar.appendChild(toggleButton);

      document.body.appendChild(toolbar);
    };

    // Check whether WebGazer has already created its container.
    setupVideoControls();

    // Otherwise, wait for WebGazer to inject it.
    observer = new MutationObserver(() => {
      setupVideoControls();

      if (toolbar) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer?.disconnect();
      toolbar?.remove();
    };
  }, [isWebGazerReady]);

  /* --------------------------------
     Calibration click handler
  -------------------------------- */

  const handleCalibrationClick = (event) => {
    if (!isWebGazerReady || isCalibrated) return;

    if (!window.webgazer?.recordScreenPosition) {
      console.error("WebGazer calibration function is unavailable.");
      return;
    }

    // Use the centre of the red dot as the calibration position.
    const rect = event.currentTarget.getBoundingClientRect();

    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    window.webgazer.recordScreenPosition(x, y);

    const nextClickCount = clicksAtPoint + 1;

    if (nextClickCount >= CLICKS_PER_POINT) {
      // Five clicks completed for this point.
      if (step === points.length - 1) {
        // All nine calibration points completed.
        setClicksAtPoint(CLICKS_PER_POINT);
        completeCalibration();

        console.log("Nine-point calibration completed.");
      } else {
        setStep((previous) => previous + 1);
        setClicksAtPoint(0);
      }
    } else {
      setClicksAtPoint(nextClickCount);
    }
  };

  /* --------------------------------
     Debug reference
  -------------------------------- */

  window.debugGaze = gazeDataRef;

  const current = points[step];

  const totalCalibrationClicks =
    step * CLICKS_PER_POINT + (isCalibrated ? CLICKS_PER_POINT : clicksAtPoint);

  /* --------------------------------
     Render
  -------------------------------- */

  return (
    <>
      {/* --------------------------------
          WebGazer error
      -------------------------------- */}

      {trackerError && hasConsented && (
        <div
          role="alert"
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 100001,
            background: "#fff",
            color: "#b00020",
            padding: "12px",
            border: "1px solid #b00020",
            borderRadius: "6px",
          }}
        >
          {trackerError}
        </div>
      )}

      {/* --------------------------------
          Calibration interface
      -------------------------------- */}

      {hasConsented && !isCalibrated && (
        <>
          <div
            style={{
              position: "fixed",
              top: 29,
              left: 28,
              zIndex: 100000,
              background: "white",
              color: "#222",
              padding: "14px",
              border: "1px solid #555",
              borderRadius: "8px",
              maxWidth: "260px",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            <strong>Eye-tracking calibration</strong>

            {!isWebGazerReady ? (
              <p>Please wait while the eye tracker starts...</p>
            ) : (
              <>
                <p>
                  Look directly at the red dot and click it five times. Keep
                  your head reasonably still.
                </p>

                <p>
                  <strong>Progress: {totalCalibrationClicks}/45 clicks</strong>
                </p>

                <p>
                  Point {step + 1}/9 — Click {clicksAtPoint + 1}/5
                </p>
              </>
            )}
          </div>

          {/* Clickable calibration target */}
          {isWebGazerReady && current && (
            <button
              type="button"
              aria-label={`Calibration point ${step + 1}. Click five times while looking at this point.`}
              onClick={handleCalibrationClick}
              style={{
                position: "fixed",
                left: current.x,
                top: current.y,
                width: "36px",
                height: "36px",
                padding: 0,
                border: "3px solid white",
                background: "#e00000",
                borderRadius: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 100002,
                cursor: "pointer",
                boxShadow: "0 0 0 2px #222",
              }}
            />
          )}
        </>
      )}

      {/* --------------------------------
          Calibration completed
      -------------------------------- */}

      {showCalibrationMessage && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            zIndex: 100000,
            background: "white",
            color: "#166534",
            padding: "12px",
            border: "1px solid #166534",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          <strong>Eye-tracking calibration completed.</strong>
        </div>
      )}

      {/* --------------------------------
          Live gaze position
      -------------------------------- */}

      {gaze && (
        <div
          style={{
            position: "fixed",
            left: gaze.x,
            top: gaze.y,
            width: "15px",
            height: "15px",
            background: "blue",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 99999,
          }}
        />
      )}

      {/* ----- Collapsible AOI Statistics ------ */}

      <div
        style={{
          position: "fixed",
          top: 80,
          left: 0,
          zIndex: 10000,
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setShowAOIStats(!showAOIStats)}
          style={{
            background: "#2426a8",
            color: "white",
            border: "none",
            borderRadius: "0 8px 8px 0",
            width: "32px",
            height: "42px",
            fontSize: "22px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
          }}
          title={showAOIStats ? "Hide AOI statistics" : "Show AOI statistics"}
        >
          {showAOIStats ? "‹" : "›"}
        </button>

        {/* Statistics Panel */}
        {showAOIStats && (
          <div
            style={{
              background: "white",
              color: "#222",
              padding: "15px",
              width: "190px",
              borderRadius: "0 10px 10px 0",
              boxShadow: "2px 3px 10px rgba(0,0,0,0.2)",
              fontSize: "13px",
              border: "1px solid #ddd",
            }}
          >
            <b
              style={{
                display: "block",
                fontSize: "14px",
                color: "#2426a8",
                marginBottom: "10px",
              }}
            >
              AOI Attention
            </b>

            {/* Gaze Points */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <span>Gaze Points</span>
              <b>{gazeDataRef.current.length}</b>
            </div>

            {/* AOI Statistics */}
            {Object.entries(aoiStats).map(([key, value]) => (
              <div
                key={key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span>{key}</span>
                <b>{value.count}</b>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --------------------------------
          Heatmap canvas
      -------------------------------- */}

      <canvas
        ref={heatmapCanvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />
    </>
  );
}

export default EyeTracker;
