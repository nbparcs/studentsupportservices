import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import TaskPanel from "../components/TaskPanel";
import VersionSwitcher from "../components/VersionSwitcher";

function BaselineLayout() {
  return (
    <>
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
