import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const StudyContext = createContext();

export function StudyProvider({ children }) {
  const [studyData, setStudyData] = useState({
    participant: "P001",
    interface: null,
    sessionStart: Date.now(),
  });

  // Consent status
  const [hasConsented, setHasConsented] = useState(
    sessionStorage.getItem("researchConsentGiven") === "true",
  );

  // WebGazer status
  const [isWebGazerReady, setIsWebGazerReady] = useState(false);

  // Calibration status
  const [isCalibrated, setIsCalibrated] = useState(false);

  const setInterface = useCallback((interfaceType) => {
    setStudyData((prev) => ({
      ...prev,
      interface: interfaceType,
    }));
  }, []);

  function completeConsent() {
    setHasConsented(true);
    sessionStorage.setItem("researchConsentGiven", "true");
  }

  function completeCalibration() {
    setIsCalibrated(true);
  }

  function resetCalibration() {
    setIsCalibrated(false);
  }

  console.log("StudyProvider rendered", {
    hasConsented,
    isCalibrated,
  });

  useEffect(() => {
    console.log("StudyProvider mounted");

    return () => {
      console.log("StudyProvider unmounted");
    };
  }, []);

  const navigationEntry = performance.getEntriesByType("navigation")[0];

  console.log("Navigation diagnostic:", {
    navigationType: navigationEntry?.type,
    currentPath: window.location.pathname,
    isCalibrated,
  });

  return (
    <StudyContext.Provider
      value={{
        studyData,
        setStudyData,
        setInterface,

        hasConsented,
        completeConsent,

        isWebGazerReady,
        setIsWebGazerReady,

        isCalibrated,
        completeCalibration,
        resetCalibration,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  return useContext(StudyContext);
}
