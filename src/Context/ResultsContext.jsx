import { createContext, useContext, useState, useEffect } from "react";

export const ResultsContext = createContext();

export function ResultsProvider({ children }) {
  const [gazeRecords, setGazeRecords] = useState([]);

  const [taskResults, setTaskResults] = useState([]);

  useEffect(() => {
    window.results = {
      gazeRecords,
      taskResults,
    };
  }, [gazeRecords, taskResults]);

  const addGazeRecord = (record) => {
    setGazeRecords((prev) => [...prev, record]);
  };

  const addTaskResult = (result) => {
    setTaskResults((prev) => [...prev, result]);
  };

  return (
    <ResultsContext.Provider
      value={{
        gazeRecords,
        taskResults,
        addGazeRecord,
        addTaskResult,
      }}
    >
      {children}
    </ResultsContext.Provider>
  );
}

export function useResults() {
  return useContext(ResultsContext);
}
