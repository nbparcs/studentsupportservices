import {
  BookOpen,
  CalendarDays,
  BookText,
  GraduationCap,
  BookOpenCheck,
  NotebookPen,
  MessageCircleQuestion,
  BookMarked,
  Presentation,
  Bookmark,
} from "lucide-react";
import { Link } from "react-router-dom";

function Academic() {
  return (
    <>
      {/* HERO */}
      <section className="hero" data-aoi="Academic Hero">
        <div className="hero-bg">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="grid"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            <span className="light">Academic</span>{" "}
            <span className="bold">Support</span>
          </h1>

          <p>
            Whether you're starting your first assignment or preparing for final
            assessments, our Learning Advisors can help you develop the skills
            you need to succeed.
          </p>
        </div>
      </section>

      {/*Quick Links*/}
      <section className="quicklinks" data-aoi="Quick Links">
        <h2>Quick Links</h2>

        <div className="qlinks">
          <a href="#"> Learning Support</a>
          <a href="#"> Academic Advising</a>
          <a href="#"> Peer Tutoring Workshops</a>
          <a href="#"> Library Support</a>
          <a href="#"> Academic Integrity</a>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services" data-aoi="Academic Services">
        <h2>Academic Services</h2>

        <div className="service-grid">
          <div className="service-card academic">
            <div className="icon">
              <NotebookPen size={30} />
            </div>

            <h3>Learning Support</h3>

            <p>
              Get help with assignments, academic writing, referencing, and
              study skills.
            </p>
          </div>

          <div className="service-card academic">
            <div className="icon">
              <BookOpenCheck size={30} />
            </div>

            <h3>Academic Advising</h3>

            <p>
              Receive guidance on programme planning, course selection, and
              academic progress.
            </p>
          </div>

          <div className="service-card academic">
            <div className="icon">
              <MessageCircleQuestion size={30} />
            </div>

            <h3>Peer Tutoring</h3>

            <p>
              Connect with trained student tutors for additional academic
              support.
            </p>
          </div>

          <div className="service-card academic">
            <div className="icon">
              <Presentation size={30} />
            </div>

            <h3>Workshops & Seminars</h3>

            <p>
              Connect with trained student tutors for additional academic
              support.
            </p>
          </div>

          <div className="service-card academic">
            <div className="icon">
              <Bookmark size={30} />
            </div>

            <h3>Library & Research Support</h3>

            <p>
              Learn how to find scholarly resources and improve your research
              skills.
            </p>
          </div>

          <div className="service-card academic">
            <div className="icon">
              <GraduationCap size={30} />
            </div>

            <h3>Academic Integrity</h3>

            <p>
              Understand plagiarism, referencing, and responsible academic
              practice.
            </p>
          </div>
        </div>
      </section>

      <section
        className="BookALearningAdvisor"
        data-aoi="Learning Advisor Section"
      >
        <div className="learn-icon">
          <BookText size={70} />
        </div>

        <h2>Book a Learning Advisor</h2>
        <p>
          Meet with a Learning Advisor for free to discuss your assignment or
          improve your academic writing. Session duration will be 30–60 minutes,
          located at Student Learning Centre or Online, from Monday to Friday
          9-5PM and for FREE.
        </p>

        <Link
          to="/baseline/AcademicAppointment"
          className="baseline-primary-btn"
          data-aoi="Book Learning Support Button"
        >
          Book Learning Support
        </Link>
      </section>

      <section className="needhelp" data-aoi="Need Help">
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
