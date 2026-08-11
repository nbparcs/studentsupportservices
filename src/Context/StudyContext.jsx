import { createContext, useContext, useState } from "react";

const StudyContext = createContext();

export function StudyProvider({ children }) {
  const [studyData, setStudyData] = useState({
    participant: "P001",
    interface: null,
    sessionStart: Date.now(),
  });

  function setInterface(interfaceType) {
    setStudyData((prev) => ({
      ...prev,
      interface: interfaceType,
    }));
  }

  return (
    <StudyContext.Provider
      value={{
        studyData,
        setStudyData,
        setInterface,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  return useContext(StudyContext);
}
