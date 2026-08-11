import { createContext, useEffect, useState } from "react";

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [activeTask, setActiveTask] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [taskResults, setTaskResults] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    if (!activeTask) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTask]);

  function startTask(task) {
    setSeconds(0);

    setActiveTask(task);
  }

  function finishTask(gazeData) {
    const result = {
      task: activeTask,
      time: seconds,
      completedAt: new Date().toISOString(),
      gazeData: gazeData,
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
        startTask,
        finishTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
