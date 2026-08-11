import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import AccessibleSidebar from "./AccessibleSidebar";
import AccessibleHeader from "./AccessibleHeader";
import VersionSwitcher from "../components/VersionSwitcher";

import TaskPanel from "../components/TaskPanel";
import EyeTracker from "../pages/baseline/EyeTracker";

import { useStudy } from "../Context/StudyContext";

function AccessibleLayout() {
  const { setInterface } = useStudy();

  const location = useLocation();

  useEffect(() => {
    setInterface("Accessible");
  }, []);

  const trackingPages = [
    "/accessible/home",
    "/accessible/academic",
    "/accessible/disability",
    "/accessible/counselling",
    "/accessible/career",
    "/accessible/it",
    "/accessible/contact",
    "/accessible/about",
    "/accessible/academicappointment",

    // IMPORTANT
    // Task pages must also track gaze
    "/accessible/task/1",
    "/accessible/task/2",
    "/accessible/task/3",
  ];

  return (
    <div className="accessible-layout">
      <AccessibleSidebar />

      <div className="accessible-main">
        {trackingPages.includes(location.pathname) && (
          <EyeTracker interfaceName="Accessible" />
        )}

        <AccessibleHeader />

        <main>
          <Outlet />
        </main>

        <TaskPanel />

        <VersionSwitcher mode="accessible" />
      </div>
    </div>
  );
}

export default AccessibleLayout;
