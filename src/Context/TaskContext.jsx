import { createContext, useEffect, useState } from "react";

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [activeTask, setActiveTask] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [taskResults, setTaskResults] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  // Task timer
  useEffect(() => {
    if (!activeTask) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTask]);

  // Start task
  function startTask(task) {
    const startedAtMs = Date.now();

    setSeconds(0);

    setActiveTask({
      ...task,
      startedAtMs,
    });
  }

  // Finish task
  function finishTask(gazeData, completedAtMs = Date.now()) {
    if (!activeTask) return null;

    const durationSeconds = (completedAtMs - activeTask.startedAtMs) / 1000;

    const result = {
      task: activeTask,
      time: durationSeconds,
      startedAtMs: activeTask.startedAtMs,
      completedAtMs,
      completedAt: new Date(completedAtMs).toISOString(),
      gazeData,
    };

    setTaskResults((previous) => [...previous, result]);

    setCompletedTasks((previous) => [...previous, activeTask]);

    setActiveTask(null);
    setSeconds(0);

    return result;
  }

  return (
    <TaskContext.Provider
      value={{
        activeTask,
        seconds,
        taskResults,
        completedTasks,
        startTask,
        finishTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
