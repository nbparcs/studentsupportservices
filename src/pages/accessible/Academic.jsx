import {
  NotebookPen,
  BookOpenCheck,
  MessageCircleQuestion,
  Presentation,
} from "lucide-react";
import { Link } from "react-router-dom";
import learningSupportImg from "../../assets/images/learningsupport.png";
import academicAdvisingImg from "../../assets/images/academicadvising.png";
import peerTutoringImg from "../../assets/images/peertutoring.png";
import workshopsImg from "../../assets/images/workshopsandseminars.png";
import librarySupportImg from "../../assets/images/libraryandresearchsupport.png";
import academicIntegrityImg from "../../assets/images/academicintegrity.png";
import bookaLearningAdvisorImg from "../../assets/images/bookalearningadvisor.png";
import academicheroImg from "../../assets/images/academic_hero.png";

function Academic() {
  return (
    <>
      {/* HERO */}
      <section
        className="accessible-hero academic-hero"
        data-aoi="Accessible Academic Hero"
        style={{
          backgroundImage: `url(${academicheroImg})`,
        }}
      >
        <div className="accessible-hero-overlay"></div>

        <div className="accessible-hero-content">
          <h1>
            Academic <span className="bold">Support</span>
          </h1>

          <p>
            Whether you're starting your first assignment or preparing for final
            assessments, our Learning Advisors can help you develop the skills
            you need to succeed.
          </p>

          <a href="#services" className="accessible-primary-btn">
            Explore Support
          </a>
        </div>
      </section>

      {/* SERVICES */}
      <section className="accessible-services" id="services">
        <h2>Academic Services</h2>

        <div className="accessible-service-grid">
          <div className="accessible-card academic">
            <img
              src={learningSupportImg}
              alt="Student receiving learning support"
              className="service-image"
            />

            <h3>Learning Support</h3>

            <p>
              Get help with assignments, academic writing, referencing, and
              study skills.
            </p>
          </div>

          <div
            className="accessible-card academic"
            data-aoi="Accessible Academic Services"
          >
            <img
              src={academicAdvisingImg}
              alt="Student receiving learning support"
              className="service-image"
            />

            <h3>Academic Advising</h3>

            <p>
              Receive guidance on programme planning, course selection, and
              academic progress.
            </p>
          </div>

          <div className="accessible-card academic">
            <img
              src={peerTutoringImg}
              alt="Student receiving learning support"
              className="service-image"
            />

            <h3>Peer Tutoring</h3>

            <p>
              Connect with trained student tutors for additional academic
              support.
            </p>
          </div>

          <div className="accessible-card academic">
            <img
              src={workshopsImg}
              alt="Student receiving learning support"
              className="service-image"
            />

            <h3>Workshops & Seminars</h3>

            <p>
              Connect with trained student tutors for additional academic
              support.
            </p>
          </div>

          <div className="accessible-card academic">
            <img
              src={librarySupportImg}
              alt="Student receiving learning support"
              className="service-image"
            />

            <h3>Library & Research Support</h3>

            <p>
              Learn how to find scholarly resources and improve your research
              skills.
            </p>
          </div>

          <div className="accessible-card academic">
            <img
              src={academicIntegrityImg}
              alt="Student receiving learning support"
              className="service-image"
            />

            <h3>Academic Integrity</h3>

            <p>
              Understand plagiarism, referencing, and responsible academic
              practice.
            </p>
          </div>
        </div>
      </section>

      {/* BOOK A LEARNING ADVISOR */}

      <section
        className="accessible-highlight"
        data-aoi="Accessible Learning Advisor Section"
      >
        <div className="highlight-content">
          <h2>Book a Learning Advisor</h2>

          <p>
            Meet with a Learning Advisor for free to discuss your assignment or
            improve your academic writing. Sessions are available for 30–60
            minutes at the Student Learning Centre or online, Monday to Friday,
            9:00 AM–5:00 PM.
          </p>

          <Link
            to="/accessible/AcademicAppointment"
            className="accessible-primary-btn"
          >
            Book Learning Support
          </Link>
        </div>

        <div className="highlight-image">
          <img
            src={bookaLearningAdvisorImg}
            alt="Student meeting with a learning advisor"
          />
        </div>
      </section>

      {/* NEED HELP */}

      <section className="accessible-contact">
        <h2>Need Additional Help?</h2>

        <p>
          Can't find what you're looking for? Our Student Support team is here
          to help.
        </p>

        <p className="helpinfo">
          <a href="#">academicsupport@studentsupport.edu.nz</a> | (07) 123 4567
        </p>
      </section>
    </>
  );
}

export default Academic;
