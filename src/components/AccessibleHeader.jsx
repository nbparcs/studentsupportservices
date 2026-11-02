import { Bell, CircleUserRound } from "lucide-react";

function AccessibleHeader() {
  return (
    <header className="accessible-header">
      <div className="header-actions">
        <Bell size={24} />
        <CircleUserRound size={28} />
      </div>
    </header>
  );
}

export default AccessibleHeader;
