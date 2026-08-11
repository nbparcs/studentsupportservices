import { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import TaskCountdown from "../../components/TaskCountdown";
import { TaskContext } from "../../Context/TaskContext";

function TaskExecution() {
  const { taskId } = useParams();
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(false);
  const { startTask } = useContext(TaskContext);
  const task = {
    1: {
      title: "Academic Support",
      scenario:
        "You have an assignment due next week and need help improving your academic writing.",
      instruction:
        "Find a student support service that can help with assignments and identify one academic support service offered.",
    },
  }[taskId];

  if (!task) {
    return <h2>Task not found</h2>;
  }

  const handleStart = () => {
    startTask({
      id: taskId,
      title: task.title,
      instruction: task.instruction,
      participant: "P001",
      interface: "Accessible",
    });

    setStarted(true);
  };

  return (
    <section
      className="task-execution"
      data-aoi="Accessible Task Execution Page"
    >
      {!started ? (
        <div className="task-start" data-aoi="Accessible Task Instructions">
          <h1 data-aoi="Accessible Task Title">
            Task {taskId} - {task.title}
          </h1>

          <div data-aoi="Accessible Task Scenario">
            <h2>Scenario</h2>

            <p>{task.scenario}</p>
          </div>

          <div data-aoi="Accessible Task Requirement">
            <h2>Your Task</h2>

            <p>{task.instruction}</p>
          </div>

          <button data-aoi="Accessible Start Task Button" onClick={handleStart}>
            Start Task
          </button>
        </div>
      ) : (
        <div className="task-running" data-aoi="Accessible Task Running">
          <h2>Task In Progress</h2>

          <p>
            Find the student support service that can help with assignments.
          </p>
        </div>
      )}
    </section>
  );
}

export default TaskExecution;
