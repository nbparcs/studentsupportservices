import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import VersionSwitcher from "../components/VersionSwitcher";
import TaskPanel from "../components/TaskPanel";
import EyeTracker from "../pages/baseline/EyeTracker";

function BaselineLayout() {
  const location = useLocation();

  const trackingPages = [
    "/baseline/home",
    "/baseline/academic",
    "/baseline/wellbeing",
    "/baseline/career",

    "/baseline/accessibility",
    "/baseline/it",
    "/baseline/about",
    "/baseline/AcademicAppointment",
  ];

  return (
    <>
      {trackingPages.includes(location.pathname) && (
        <EyeTracker interfaceName="Baseline" />
      )}

      <Navbar />

      <main className="page">
        <Outlet />
      </main>

      <TaskPanel />

      <VersionSwitcher mode="baseline" />
    </>
  );
}

export default BaselineLayout;
