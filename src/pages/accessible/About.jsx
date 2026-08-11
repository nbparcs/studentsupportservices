import { Users, Accessibility, Target } from "lucide-react";

function About() {
  return (
    <>
      {/* HERO */}
      <section className="accessible-hero">
        {/* Background graphics */}
        <div className="accessible-hero-bg">
          <div className="accessible-circle accessible-circle-1"></div>
          <div className="accessible-circle accessible-circle-2"></div>
          <div className="accessible-grid"></div>
        </div>

        <div className="accessible-hero-content">
          <h1>
            About <span className="bold">Student Connect</span>
          </h1>

          <p>
            A student support services platform designed to help students easily
            find academic, wellbeing, career, IT and accessibility support in
            one place.
          </p>

          <a href="#about" className="accessible-primary-btn">
            Learn More
          </a>
        </div>
      </section>

      {/* ABOUT CONTENT */}
      <section className="accessible-services" id="about">
        <h2>Supporting Student Success</h2>

        <p className="section-description">
          Student Connect provides a central platform where students can quickly
          access essential support services throughout their studies.
        </p>

        <div className="accessible-service-grid">
          {/* Purpose */}
          <div className="accessible-card">
            <div className="accessible-icon about-icon">
              <Target size={32} />
            </div>

            <h3>Our Purpose</h3>

            <p>
              To simplify access to student support information by providing an
              easy-to-use and inclusive digital platform.
            </p>
          </div>

          {/* Student Focus */}
          <div className="accessible-card">
            <div className="accessible-icon about-icon">
              <Users size={32} />
            </div>

            <h3>Student Focused</h3>

            <p>
              Designed around student needs by bringing important services
              together in one accessible location.
            </p>
          </div>

          {/* Accessibility */}
          <div className="accessible-card">
            <div className="accessible-icon about-icon">
              <Accessibility size={32} />
            </div>

            <h3>Inclusive Design</h3>

            <p>
              Created with accessibility principles to support diverse learners
              and improve digital experiences.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default About;
