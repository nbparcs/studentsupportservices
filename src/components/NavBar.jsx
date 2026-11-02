import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/studentconnect_logo.png";
import { CircleUserRound } from "lucide-react";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="logo-section">
        <Link to="/baseline/home">
          <img src={logo} alt="Student Connect" className="logo" />
        </Link>
      </div>

      <nav className="nav-links">
        <NavLink to="/baseline/academic">Academic</NavLink>
        <NavLink to="/baseline/counselling">Counselling</NavLink>
        <NavLink to="/baseline/disability">Disability</NavLink>
        <NavLink to="/baseline/career">Career</NavLink>
        <NavLink to="/baseline/it">IT Support</NavLink>
        <NavLink to="/baseline/contact">Contact</NavLink>
        <NavLink to="/baseline/tasks" className="nav-link">
          Tasks
        </NavLink>
      </nav>

      <div className="profile-icon">
        <CircleUserRound size={28} />
      </div>
    </header>
  );
}

export default Navbar;
