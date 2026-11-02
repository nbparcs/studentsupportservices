import "./App.css";
import "./styles/Accessible.css";

import { Routes, Route, Navigate } from "react-router-dom";

import { useStudy } from "./Context/StudyContext";
import ParticipantPopup from "./components/ParticipantPopUp";

import EyeTracker from "./pages/baseline/EyeTracker";

// Baseline pages
import BaselineLayout from "./components/BaselineLayout";
import Home from "./pages/baseline/Home";
import Academic from "./pages/baseline/Academic";
import Disability from "./pages/baseline/Disability";
import Counselling from "./pages/baseline/Counselling";
import Career from "./pages/baseline/Career";
import IT from "./pages/baseline/ITSupport";
import About from "./pages/baseline/About";
import Contact from "./pages/baseline/Contact";
import AcademicAppointment from "./pages/baseline/AcademicAppointment";
import BaselineTasks from "./pages/baseline/Tasks";
import BaselineTaskExecution from "./pages/baseline/TaskExecution";
import ResetPassword from "./pages/baseline/ResetPassword";

// Accessible pages
import AccessibleLayout from "./components/AccessibleLayout";
import AccessibleHome from "./pages/accessible/Home";
import AccessibleAcademic from "./pages/accessible/Academic";
import AccessibleDisability from "./pages/accessible/Disability";
import AccessibleCounselling from "./pages/accessible/Counselling";
import AccessibleCareer from "./pages/accessible/Career";
import AccessibleIT from "./pages/accessible/ITSupport";
import AccessibleContact from "./pages/accessible/Contact";
import AccessibleAbout from "./pages/accessible/About";
import AccessibleAcademicAppointment from "./pages/accessible/AcademicAppointment";
import AccessibleTasks from "./pages/accessible/Tasks";
import AccessibleTaskExecution from "./pages/accessible/TaskExecution";
import AccessibleResetPassword from "./pages/accessible/ResetPassword";

function App() {
  const { hasConsented, completeConsent } = useStudy();

  return (
    <div className="app">
      {/* Consent appears once, regardless of the selected interface */}
      {!hasConsented && <ParticipantPopup onComplete={completeConsent} />}

      {/* One shared EyeTracker for the entire study */}
      {hasConsented && <EyeTracker />}

      <main className="page">
        <Routes>
          <Route path="/" element={<Navigate to="/baseline/home" replace />} />

          {/* Baseline */}
          <Route path="/baseline" element={<BaselineLayout />}>
            <Route path="home" element={<Home />} />
            <Route path="academic" element={<Academic />} />
            <Route path="disability" element={<Disability />} />
            <Route path="counselling" element={<Counselling />} />
            <Route path="career" element={<Career />} />
            <Route path="it" element={<IT />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route
              path="academicappointment"
              element={<AcademicAppointment />}
            />
            <Route path="tasks" element={<BaselineTasks />} />
            <Route path="task/:taskId" element={<BaselineTaskExecution />} />
            <Route path="resetpassword" element={<ResetPassword />} />
          </Route>

          {/* Accessible */}
          <Route path="/accessible" element={<AccessibleLayout />}>
            <Route path="home" element={<AccessibleHome />} />
            <Route path="academic" element={<AccessibleAcademic />} />
            <Route path="disability" element={<AccessibleDisability />} />
            <Route path="counselling" element={<AccessibleCounselling />} />
            <Route path="career" element={<AccessibleCareer />} />
            <Route path="it" element={<AccessibleIT />} />
            <Route path="contact" element={<AccessibleContact />} />
            <Route path="about" element={<AccessibleAbout />} />
            <Route
              path="academicappointment"
              element={<AccessibleAcademicAppointment />}
            />
            <Route path="tasks" element={<AccessibleTasks />} />
            <Route path="task/:taskId" element={<AccessibleTaskExecution />} />
            <Route path="resetpassword" element={<AccessibleResetPassword />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
