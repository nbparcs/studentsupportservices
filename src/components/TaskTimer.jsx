import { useEffect, useState } from "react";

function TaskTimer({ running }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [running]);

  return (
    <div className="task-timer">
      <h3>⏱ Time: {seconds}s</h3>
    </div>
  );
}

export default TaskTimer;
