import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TaskContext } from "../Context/TaskContext.jsx";

function TaskCard({ title, scenario, instruction, link }) {
  const navigate = useNavigate();

  const { startTask } = useContext(TaskContext);

  const handleStart = () => {
    startTask({
      id: title,
      title,
      scenario,
      instruction,
      startTime: Date.now(),
    });

    navigate(link);
  };

  return (
    <div className="task-card">
      <h2>{title}</h2>

      <details>
        <summary>View Task Instructions</summary>

        <p>{scenario}</p>

        <p>
          <strong>Your task:</strong> {instruction}
        </p>

        <button onClick={handleStart}>Start Task</button>
      </details>
    </div>
  );
}

export default TaskCard;
