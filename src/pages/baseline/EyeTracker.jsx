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

  const location = useLocation();

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
              top: 20,
              left: 20,
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

      {hasConsented && isCalibrated && (
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

      {/* --------------------------------
          Debug: gaze points
      -------------------------------- */}

      <div
        style={{
          position: "fixed",
          top: 80,
          left: 20,
          zIndex: 10000,
          background: "white",
          color: "#222",
          padding: "10px",
          fontSize: "12px",
        }}
      >
        Points: {gazeDataRef.current.length}
      </div>

      {/* --------------------------------
          AOI statistics
      -------------------------------- */}

      <div
        style={{
          position: "fixed",
          top: 150,
          left: 20,
          zIndex: 10000,
          background: "white",
          color: "#222",
          padding: "10px",
          fontSize: "12px",
        }}
      >
        <b>AOI Attention</b>

        {Object.entries(aoiStats).map(([key, value]) => (
          <div key={key}>
            {key}: {value.count}
          </div>
        ))}
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
