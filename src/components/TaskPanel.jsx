import { useContext } from "react";
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

  if (!activeTask) {
    return null;
  }

  const handleFinish = () => {
    const gazeData = window.debugGaze.current;

    console.log("GAZE LENGTH:", gazeData.length);

    console.log("FIRST GAZE:", gazeData[0]);

    const aoiAttention = calculateAOIAttention(gazeData);

    console.log("AOI RESULT:", aoiAttention);

    const result = finishTask(gazeData);

    result.analysis = {
      aoiAttention,
      viewingTime: calculateViewingTime(gazeData),
      gazePath: getGazePath(gazeData),
    };

    addTaskResult(result);

    console.log("FINAL RESULT:", result);
  };

  return (
    <div className="task-panel-floating">
      <h3>
        Task {activeTask.id}: {activeTask.title}
      </h3>

      <p>{activeTask.instruction}</p>

      <h3>⏱ Time: {seconds}s</h3>

      <button className="finish-task-btn" onClick={handleFinish}>
        Finish Task
      </button>
    </div>
  );
}

export default TaskPanel;
