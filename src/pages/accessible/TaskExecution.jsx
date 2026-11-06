import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TaskContext } from "../../Context/TaskContext";
import { ensureResearchSession } from "../../utils/researchApi.js";

function TaskExecution() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { startTask } = useContext(TaskContext);

  const tasks = {
    1: {
      title: "Academic Support",
      scenario:
        "You have an assignment due next week and need help improving your academic writing.",
      instruction:
        "Find a student support service that can help with assignments and identify one academic support service offered.",
    },
    2: {
      title: "Disability Support",
      scenario:
        "You think you may need disability support at university and want to know when you should register.",
      instruction:
        "Find out when students are encouraged to register for Disability Support.",
    },
    3: {
      title: "IT Support",
      scenario:
        "You are trying to reset your university password, but your new password is not being accepted.",
      instruction:
        "Find out what requirements your new password must meet so you can reset it successfully.",
    },
  };

  const task = tasks[taskId];

  if (!task) {
    return <h2>Task not found</h2>;
  }

  const handleStart = async () => {
    try {
      const sessionId = await ensureResearchSession();

      const participant = sessionStorage.getItem("researchParticipantCode");

      console.log("Starting task with session:", {
        sessionId,
        participant,
        taskId,
      });

      startTask({
        id: taskId,
        title: task.title,
        instruction: task.instruction,
        participant,
        sessionId: Number(sessionId),
        interface: "Accessible",
      });

      navigate("/accessible/home");
    } catch (error) {
      console.error("Could not start research session:", error);
      alert("Unable to connect to the research database. Please try again.");
    }
  };

  return (
    <section
      className="task-execution"
      data-aoi="Accessible Task Execution Page"
    >
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

        <button
          className="primary-btn "
          data-aoi="Accessible Start Task Button"
          onClick={handleStart}
        >
          Start Task
        </button>
      </div>
    </section>
  );
}

export default TaskExecution;
