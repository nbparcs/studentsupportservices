import { useEffect, useState, useRef, useContext } from "react";
import { useStudy } from "../../Context/StudyContext.jsx";
import { ResultsContext } from "../../Context/ResultsContext.jsx";
import { findAOI, updateAOIs } from "../../utils/aoiTracker.js";
import { useLocation } from "react-router-dom";

function EyeTracker({ interfaceName }) {
  const [step, setStep] = useState(0);
  const [gaze, setGaze] = useState(null);
  const [aoiStats, setAoiStats] = useState({});

  const heatmapCanvasRef = useRef(null);
  const location = useLocation();
  const gazeDataRef = useRef([]);
  const webgazerStarted = useRef(false);
  const aoiStatsRef = useRef({});
  const { studyData } = useStudy();
  const { addGazeRecord } = useContext(ResultsContext);

  /* Refresh AOIs whenever page changes  */

  useEffect(() => {
    const timer = setTimeout(() => {
      updateAOIs();

      console.log("AOIs updated:", location.pathname);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);

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

  /*Heatmap drawing */

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

  /* Start WebGazer once */

  useEffect(() => {
    if (!window.webgazer) return;

    const startWebGazer = async () => {
      if (webgazerStarted.current) return;

      webgazerStarted.current = true;

      await window.webgazer

        .setTracker("TFFacemesh")
        .setRegression("ridge")
        .setGazeListener((data) => {
          if (!data) return;

          const aoi = findAOI(data.x, data.y);

          const timestamp = Date.now();

          const gazeRecord = {
            participant: studyData.participant,
            interface: interfaceName,
            page: window.location.pathname,
            x: data.x,
            y: data.y,
            timestamp,
            aoi,
          };

          gazeDataRef.current.push(gazeRecord);

          addGazeRecord(gazeRecord);

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

          setAoiStats({
            ...aoiStatsRef.current,
          });

          setGaze({
            x: data.x,
            y: data.y,
          });
        })

        .begin();

      window.webgazer.showVideo(true);
      window.webgazer.showFaceOverlay(true);
      window.webgazer.showPredictionPoints(true);
    };

    startWebGazer();

    /* Calibration */

    const handleClick = (event) => {
      setStep((previous) => {
        if (previous >= points.length) return previous;

        window.webgazer.recordScreenPosition(
          event.clientX,

          event.clientY,
        );

        return previous + 1;
      });
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);

      /* my safer cleanup but Do NOT use end() */

      try {
        if (window.webgazer) {
          window.webgazer.pause();
        }
      } catch (error) {
        console.warn("WebGazer cleanup:", error);
      }

      webgazerStarted.current = false;
    };
  }, []);

  window.debugGaze = gazeDataRef;

  const current = points[step];

  return (
    <>
      {/* Calibration */}

      <div
        style={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 10000,
          background: "white",
          padding: "10px",
          border: "1px solid black",
        }}
      >
        Calibration:
        {step}/9
      </div>

      {step < points.length && current && (
        <div
          style={{
            position: "fixed",
            left: current.x,
            top: current.y,
            width: "25px",
            height: "25px",
            background: "red",
            borderRadius: "50%",
            transform: "translate(-50%,-50%)",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}

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
            transform: "translate(-50%,-50%)",
            pointerEvents: "none",
            zIndex: 99999,
          }}
        />
      )}

      {/* Debug */}

      <div
        style={{
          position: "fixed",
          top: 80,
          left: 20,
          zIndex: 10000,
          background: "white",
          padding: "10px",
          fontSize: "12px",
        }}
      >
        Points:
        {gazeDataRef.current.length}
      </div>

      {/* AOI */}

      <div
        style={{
          position: "fixed",
          top: 150,
          left: 20,
          zIndex: 10000,
          background: "white",
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
