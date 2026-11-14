import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { TaskContext } from "../Context/TaskContext.jsx";
import { ensureResearchSession } from "../utils/researchApi.js";

function TaskCard({ title, scenario, instruction, link }) {
  const navigate = useNavigate();
  const { startTask } = useContext(TaskContext);

  const handleStart = async () => {
    try {
      // Determine which interface is being used
      const isAccessible = link.startsWith("/accessible/");
      const interfaceName = isAccessible ? "Accessible" : "Baseline";

      // Get task ID from existing link (e.g. /baseline/task/1)
      const taskId = link.split("/").pop();

      // Create or reuse the research session
      const sessionId = await ensureResearchSession();

      const participant = sessionStorage.getItem("researchParticipantCode");

      console.log("Starting task:", {
        sessionId,
        participant,
        taskId,
        interfaceName,
      });

      // Start task directly
      startTask({
        id: taskId,
        title,
        scenario,
        instruction,
        participant,
        sessionId: Number(sessionId),
        interface: interfaceName,
      });

      // Navigate directly to the appropriate home page
      navigate(isAccessible ? "/accessible/home" : "/baseline/home");
    } catch (error) {
      console.error("Could not start research task:", error);

      alert("Unable to connect to the research database. Please try again.");
    }
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
