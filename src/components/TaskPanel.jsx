import { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { TaskContext } from "../Context/TaskContext.jsx";
import { useResults } from "../Context/ResultsContext.jsx";

import {
  calculateAOIAttention,
  calculateViewingTime,
  getGazePath,
} from "../utils/gazeAnalysis";

function TaskPanel() {
  const { activeTask, seconds, finishTask } = useContext(TaskContext);
  const { addTaskResult } = useResults();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Reset the completion screen whenever a new task starts.
    setSaved(false);
    setSaving(false);
  }, [activeTask?.id]);

  if (!activeTask) {
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

      const analysis = {
        aoiAttention: calculateAOIAttention(gazeData),
        viewingTime: calculateViewingTime(gazeData),
        gazePath: getGazePath(gazeData),
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
          durationSeconds: seconds,
          completed: true,
          startedAtMs: completedAtMs - seconds * 1000,
          completedAtMs,
          analysis,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Could not save task results.");
      }

      console.log("Task result saved to database:", responseData);

      // Close the session after the task result is saved.
      try {
        const endResponse = await fetch(
          `http://localhost:3001/api/sessions/${sessionId}/end`,
          { method: "PATCH" },
        );

        const endData = await endResponse.json();

        if (!endResponse.ok) {
          throw new Error(endData.error || "Could not end research session.");
        }

        console.log("Research session ended:", endData.session);
      } catch (endError) {
        console.error(
          "Task result saved, but session could not be closed:",
          endError,
        );
      }

      const result = finishTask(gazeData);
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
    <div className="task-panel-floating">
      {saved ? (
        <>
          <h3>Task completed!</h3>
          <p>Your task results have been saved successfully.</p>

          <button
            className="finish-task-btn"
            onClick={() => navigate(tasksPath)}
          >
            Back to Tasks
          </button>
        </>
      ) : (
        <>
          <h3>
            Task {activeTask.id}: {activeTask.title}
          </h3>

          <p>{activeTask.instruction}</p>

          <h3>⏱ Time: {seconds}s</h3>

          <button
            className="finish-task-btn"
            onClick={handleFinish}
            disabled={saving}
          >
            {saving ? "Saving..." : "Finish Task"}
          </button>
        </>
      )}
    </div>
  );
}

export default TaskPanel;
