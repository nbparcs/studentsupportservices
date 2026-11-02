import { useEffect } from "react";
import { Outlet } from "react-router-dom";

import AccessibleSidebar from "./AccessibleSidebar";
import AccessibleHeader from "./AccessibleHeader";
import VersionSwitcher from "../components/VersionSwitcher";
import TaskPanel from "../components/TaskPanel";

import { useStudy } from "../Context/StudyContext";

function AccessibleLayout() {
  const { setInterface } = useStudy();

  useEffect(() => {
    setInterface("Accessible");
  }, [setInterface]);

  return (
    <div className="accessible-layout">
      <AccessibleSidebar />

      <div className="accessible-main">
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
