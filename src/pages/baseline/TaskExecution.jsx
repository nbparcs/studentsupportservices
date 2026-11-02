import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { TaskContext } from "../../Context/TaskContext";
import { ensureResearchSession } from "../../utils/researchApi";

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
    return <h2>Task not found.</h2>;
  }

  const handleStart = async () => {
    try {
      // Create one session for this task.
      const sessionId = await ensureResearchSession();

      const participant = sessionStorage.getItem("researchParticipantCode");

      startTask({
        id: taskId,
        title: task.title,
        instruction: task.instruction,
        participant,
        sessionId,
        interface: "Baseline",
      });

      navigate("/baseline/home");
    } catch (error) {
      console.error("Could not start research session:", error);
      alert("Unable to connect to the research database. Please try again.");
    }
  };

  return (
    <>
      {/* ================================
          HERO SECTION
      ================================= */}

      <section className="hero" data-aoi="Task Hero">
        {/* Decorative background */}
        <div className="hero-bg">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="grid"></div>
        </div>

        {/* Hero content */}
        <div className="hero-content">
          <h1 className="hero-title">
            Task {taskId}: <span className="bold">{task.title}</span>
          </h1>

          <p>
            Complete the task by navigating through Student Connect and finding
            the information described below.
          </p>
        </div>
      </section>

      {/* ================================
          TASK INSTRUCTIONS
      ================================= */}

      <section className="services">
        <h2>Task Instructions</h2>

        <div className="task-instruction-card">
          <div className="task-instruction-section" data-aoi="Task Scenario">
            <h3>Scenario</h3>

            <p>{task.scenario}</p>
          </div>

          <div className="task-instruction-section" data-aoi="Task Requirement">
            <h3>Your Task</h3>

            <p>{task.instruction}</p>
          </div>

          <button
            className="primary-btn"
            onClick={handleStart}
            data-aoi="Start Task Button"
          >
            Start Task
          </button>
        </div>
      </section>
    </>
  );
}

{
  /* ================================
          TASK RUNNING
      ================================= */
}

{
  <section className="services">
    <h2>Task in Progress</h2>

    <div className="task-instruction-card">
      <p>
        Complete the task by navigating through the Student Connect website.
      </p>

      <p>
        When you have successfully completed the task, click the button below.
      </p>
    </div>
  </section>;
}

export default TaskExecution;
