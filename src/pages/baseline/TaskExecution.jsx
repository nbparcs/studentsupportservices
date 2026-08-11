import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import TaskCountdown from "../../components/TaskCountdown";

import { TaskContext } from "../../Context/TaskContext";

function TaskExecution() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [countdown, setCountdown] = useState(false);

  const { startTask, finishTask } = useContext(TaskContext);

  const tasks = {
    1: {
      title: "Academic Support",
      scenario:
        "You have an assignment due next week and need help improving your academic writing.",
      instruction:
        "Find a student support service that can help with assignments and identify one academic support service offered.",
    },

    2: {
      title: "Counselling Support",
      scenario:
        "You are feeling stressed and would like to access wellbeing support.",
      instruction:
        "Find the counselling service and identify one type of support available.",
    },

    3: {
      title: "Disability Support",
      scenario: "You require learning adjustments to support your studies.",
      instruction:
        "Locate the Disability Support page and identify one accessibility service offered.",
    },

    4: {
      title: "Career Services",
      scenario: "You are preparing to apply for an internship.",
      instruction:
        "Find Career Services and identify one service that helps students prepare for employment.",
    },

    5: {
      title: "IT Support",
      scenario: "You cannot connect your laptop to the campus Wi-Fi.",
      instruction:
        "Locate the IT Support page and identify one type of technical assistance available.",
    },

    6: {
      title: "Contact Student Services",
      scenario: "You would like to contact Student Support.",
      instruction:
        "Find the Contact page and identify one available contact method.",
    },

    7: {
      title: "About Student Connect",
      scenario: "You want to learn what Student Connect provides.",
      instruction:
        "Locate the About page and identify the purpose of Student Connect.",
    },
  };

  const task = tasks[taskId];

  if (!task) {
    return <h2>Task not found.</h2>;
  }

  const handleStart = () => {
    startTask({
      id: taskId,
      title: task.title,
      instruction: task.instruction,
      participant: "P001",
      interface: "Baseline",
    });

    setCountdown(true);
  };

  const handleFinish = () => {
    finishTask();

    setCompleted(true);

    alert("Task Completed!");

    navigate("/baseline/tasks");
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
          COUNTDOWN
      ================================= */}

      {countdown && !started && (
        <TaskCountdown
          onComplete={() => {
            setStarted(true);
            navigate("/baseline/home");
          }}
        />
      )}

      {/* ================================
          TASK INSTRUCTIONS
      ================================= */}

      {!started && !countdown && (
        <section className="services">
          <h2>Task Instructions</h2>

          <div className="task-instruction-card">
            <div className="task-instruction-section" data-aoi="Task Scenario">
              <h3>Scenario</h3>

              <p>{task.scenario}</p>
            </div>

            <div
              className="task-instruction-section"
              data-aoi="Task Requirement"
            >
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
      )}

      {/* ================================
          TASK RUNNING
      ================================= */}

      {started && (
        <section className="services">
          <h2>Task in Progress</h2>

          <div className="task-instruction-card">
            <p>
              Complete the task by navigating through the Student Connect
              website.
            </p>

            <p>
              When you have successfully completed the task, click the button
              below.
            </p>

            <button
              className="secondary-btn"
              onClick={handleFinish}
              data-aoi="Finish Task Button"
            >
              Finish Task
            </button>

            {completed && <p>Task Completed!</p>}
          </div>
        </section>
      )}
    </>
  );
}

export default TaskExecution;
