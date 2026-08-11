import {
  BriefcaseBusiness,
  FileText,
  UserRoundCheck,
  Search,
} from "lucide-react";

function Career() {
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
            Career <span className="bold">Services</span>
          </h1>

          <p>
            Explore career guidance, employment resources and professional
            development support to prepare for your future.
          </p>

          <a href="#support" className="accessible-primary-btn">
            Explore Support
          </a>
        </div>
      </section>

      {/* SERVICES */}
      <section className="accessible-services" id="support">
        <h2>Career Services</h2>

        <p className="section-description">
          Access career resources and guidance to support your professional
          journey.
        </p>

        <div className="accessible-service-grid">
          {/* CV Reviews */}
          <div className="accessible-card career">
            <div className="accessible-icon">
              <FileText size={32} />
            </div>

            <h3>CV Reviews</h3>

            <p>
              Get feedback and guidance to improve your CV, cover letters and
              job applications.
            </p>

            <a href="#">Read More</a>
          </div>

          {/* Interview Preparation */}
          <div className="accessible-card career">
            <div className="accessible-icon">
              <UserRoundCheck size={32} />
            </div>

            <h3>Interview Preparation</h3>

            <p>
              Develop confidence and improve interview skills through practice
              sessions and career advice.
            </p>

            <a href="#">Read More</a>
          </div>

          {/* Job Search Support */}
          <div className="accessible-card career">
            <div className="accessible-icon">
              <Search size={32} />
            </div>

            <h3>Job Search Support</h3>

            <p>
              Find employment opportunities and receive guidance on career
              planning and workplace preparation.
            </p>

            <a href="#">Read More</a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Career;
