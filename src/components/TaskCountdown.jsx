import { createContext, useContext, useState, useEffect } from "react";

function TaskCountdown({ onComplete }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          clearInterval(timer);

          setTimeout(() => {
            onComplete();
          }, 0);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="task-countdown">
      <h2>Starting task in {count}</h2>
    </div>
  );
}

export default TaskCountdown;
