import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { TaskContext } from "../Context/TaskContext.jsx";
import { useResults } from "../Context/ResultsContext.jsx";

import {
  calculateAOIAttention,
  calculateViewingTime,
  getGazePath,
  calculateFixations,
} from "../utils/gazeAnalysis";

function TaskPanel() {
  const { activeTask, seconds, finishTask } = useContext(TaskContext);
  const { addTaskResult } = useResults();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (activeTask) {
      setSaved(false);
      setSaving(false);
    }
  }, [activeTask?.id]);

  if (!activeTask && !saved) {
    return null;
  }

  const isAccessible = location.pathname.startsWith("/accessible");
  const tasksPath = isAccessible ? "/accessible/tasks" : "/baseline/tasks";

  const handleFinish = async () => {
    if (saving || saved) return;

    setSaving(true);

    try {
      const sessionId = activeTask.sessionId;

      if (!sessionId) {
        throw new Error("No research session ID is associated with this task.");
      }

      // Stop collecting new samples before uploading.
      window.gazeCollectionEnabled = false;

      // Upload pending gaze samples first.
      if (typeof window.flushPendingGazeSamples !== "function") {
        throw new Error("Gaze upload function is not available.");
      }

      const uploadResult = await window.flushPendingGazeSamples(
        Number(sessionId),
      );

      console.log("Gaze upload completed:", uploadResult);

      // Get the gaze data after collection has stopped.
      const gazeData = window.debugGaze?.current || [];

      const fixationAnalysis = calculateFixations(gazeData);

      const analysis = {
        aoiAttention: calculateAOIAttention(gazeData),
        viewingTime: calculateViewingTime(gazeData),
        gazePath: getGazePath(gazeData),

        fixationCount: fixationAnalysis.fixationCount,
        totalFixationDuration: fixationAnalysis.totalFixationDuration,
        meanFixationDuration: fixationAnalysis.meanFixationDuration,
        fixations: fixationAnalysis.fixations,
      };

      const completedAtMs = Date.now();

      const response = await fetch("http://localhost:3001/api/task-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: Number(sessionId),
          taskCode: String(activeTask.id),
          taskTitle: activeTask.title,
          interfaceName: activeTask.interface,

          durationSeconds: Math.floor(
            (completedAtMs - activeTask.startedAtMs) / 1000,
          ),

          completed: true,
          startedAtMs: activeTask.startedAtMs,
          completedAtMs,
          analysis,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Could not save task results.");
      }

      console.log("Task result saved to database:", responseData);

      const result = finishTask(gazeData, completedAtMs);
      result.analysis = analysis;
      addTaskResult(result);

      setSaved(true);
      console.log("FINAL RESULT:", result);
    } catch (error) {
      console.error("Could not save task result:", error);

      alert(
        "The task result could not be saved. Please check the Console and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`task-panel-floating ${isCollapsed ? "collapsed" : ""}`}>
      {/* Panel Header */}
      <div className="task-panel-header">
        <span>Current Task</span>

        <button
          type="button"
          className="task-panel-toggle"
          onClick={() => setIsCollapsed((prev) => !prev)}
          aria-label={isCollapsed ? "Expand task panel" : "Collapse task panel"}
          aria-expanded={!isCollapsed}
        >
          {isCollapsed ? "+" : "−"}
        </button>
      </div>

      {/* Task Content */}
      {!isCollapsed && (
        <div className="task-panel-content">
          <h3>{activeTask?.title}</h3>

          <p>{activeTask?.instructions}</p>

          <div className="task-timer">
            <span>Time Taken</span>
            <h3>
              {Math.floor(seconds / 60)
                .toString()
                .padStart(2, "0")}
              :{(seconds % 60).toString().padStart(2, "0")}
            </h3>
          </div>

          {!saved ? (
            <button
              type="button"
              className="finish-task-btn"
              onClick={handleFinish}
              disabled={saving}
            >
              {saving ? "Saving Results..." : "Finish Task"}
            </button>
          ) : (
            <button
              type="button"
              className="finish-task-btn"
              onClick={() => navigate(tasksPath)}
            >
              Back to Tasks
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskPanel;
