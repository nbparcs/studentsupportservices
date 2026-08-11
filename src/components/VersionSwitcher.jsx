import { Link } from "react-router-dom";
import { Accessibility, Monitor } from "lucide-react";

function VersionSwitcher({ mode }) {
  const isBaseline = mode === "baseline";

  return (
    <Link
      to={isBaseline ? "/accessible/home" : "/baseline/home"}
      className="version-switcher"
    >
      {isBaseline ? <Accessibility size={22} /> : <Monitor size={22} />}

      {isBaseline ? "Accessible View" : "Standard View"}
    </Link>
  );
}

export default VersionSwitcher;
