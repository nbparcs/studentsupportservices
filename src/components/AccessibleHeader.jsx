import { Bell, CircleUserRound } from "lucide-react";
import EyeTrackerToggle from "./EyeTrackerToggle";

function AccessibleHeader() {
  return (
    <header className="accessible-header">
      <EyeTrackerToggle />
      <div className="header-actions">
        <Bell size={24} />
        <CircleUserRound size={28} />
      </div>
    </header>
  );
}

export default AccessibleHeader;
