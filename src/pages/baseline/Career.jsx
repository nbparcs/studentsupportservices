import { BriefcaseBusiness, FileText, Users, Search } from "lucide-react";

function Career() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="grid"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Career <span className="bold">Services</span>
          </h1>

          <p>
            Prepare for your future career through personalised guidance,
            employability workshops, and professional development resources.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="services">
        <h2>Available Career Support</h2>

        <div className="service-grid">
          <div className="service-card">
            <div className="icon career">
              <FileText size={32} />
            </div>

            <h3>CV & Cover Letter Reviews</h3>

            <p>
              Receive feedback to improve your CV and cover letter before
              applying for internships or graduate positions.
            </p>
          </div>

          <div className="service-card">
            <div className="icon career">
              <Users size={32} />
            </div>

            <h3>Interview Preparation</h3>

            <p>
              Practise interview techniques and build confidence through mock
              interviews and career coaching sessions.
            </p>
          </div>

          <div className="service-card">
            <div className="icon career">
              <Search size={32} />
            </div>

            <h3>Job Search Support</h3>

            <p>
              Learn effective job search strategies, networking skills and how
              to find graduate employment opportunities.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Career;
