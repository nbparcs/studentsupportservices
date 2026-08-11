import { NavLink } from "react-router-dom";
import logo from "../assets/studentconnect_logo.png";
import {
  Home,
  GraduationCap,
  Accessibility,
  HeartHandshake,
  BriefcaseBusiness,
  Laptop,
  PhoneCall,
} from "lucide-react";

import "../styles/Accessible.css";

function AccessibleSidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src={logo} alt="Student Connect" />
      </div>

      <nav>
        <NavLink to="/accessible/home" className="sidebar-link">
          <Home size={20} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/accessible/academic" className="sidebar-link">
          <GraduationCap size={20} />
          <span>Academic Support</span>
        </NavLink>

        <NavLink to="/accessible/counselling" className="sidebar-link">
          <HeartHandshake size={20} />
          <span>Counselling</span>
        </NavLink>

        <NavLink to="/accessible/disability" className="sidebar-link">
          <Accessibility size={20} />
          <span>Disability Support</span>
        </NavLink>

        <NavLink to="/accessible/career" className="sidebar-link">
          <BriefcaseBusiness size={20} />
          <span>Career Support</span>
        </NavLink>

        <NavLink to="/accessible/it" className="sidebar-link">
          <Laptop size={20} />
          <span>IT Support</span>
        </NavLink>

        <NavLink to="/accessible/contact" className="sidebar-link">
          <PhoneCall size={20} />
          <span>Contact</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default AccessibleSidebar;
