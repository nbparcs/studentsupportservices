import { Link } from "react-router-dom";
import {
  GraduationCap,
  HeartHandshake,
  Accessibility,
  BriefcaseBusiness,
  Laptop,
  PhoneCall,
} from "lucide-react";

function Home() {
  return (
    <>
      {/* HERO SECTION */}
      <section className="hero" data-aoi="hero">
        {/* decorative background elements */}
        <div className="hero-bg">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="grid"></div>
        </div>

        {/* content */}
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="bold">Student Connect</span>
          </h1>

          <p>
            A student support services platform that helps students easily
            access academic, wellbeing, career, IT and accessibility support in
            one place.
          </p>

          <Link to="/baseline/about" className="primary-btn">
            Read More
          </Link>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="services">
        <h2>Student Support Services</h2>

        <div className="service-grid">
          {/* ACADEMIC */}
          <div className="service-card academic" data-aoi="Academic Card">
            <div className="icon">
              <GraduationCap size={32} />
            </div>

            <h3>Academic Support</h3>

            <p>Study workshops, learning advisors, assignment assistance.</p>

            <Link to="/baseline/academic" className="secondary-btn">
              Read More
            </Link>
          </div>

          {/* COUNSELLING */}
          <div className="service-card counselling">
            <div className="icon">
              <HeartHandshake size={32} />
            </div>

            <h3>Counselling</h3>

            <p>Confidential mental health support and wellbeing resources.</p>

            <Link to="/baseline/counselling" className="secondary-btn">
              Read More
            </Link>
          </div>

          {/* DISABILITY */}
          <div className="service-card disability" data-aoi="Disability Card">
            <div className="icon">
              <Accessibility size={32} />
            </div>

            <h3>Disability Support</h3>

            <p>
              Learning accommodations, accessibility assistance and exam
              support.
            </p>

            <Link to="/baseline/disability" className="secondary-btn">
              Read More
            </Link>
          </div>

          {/* CAREER */}
          <div className="service-card career">
            <div className="icon">
              <BriefcaseBusiness size={32} />
            </div>

            <h3>Career Services</h3>

            <p>CV reviews, interview preparation and job search support.</p>

            <Link to="/baseline/career" className="secondary-btn">
              Read More
            </Link>
          </div>

          {/* IT */}
          <div className="service-card it" data-aoi="IT Support Card">
            <div className="icon">
              <Laptop size={32} />
            </div>

            <h3>IT Support</h3>

            <p>Password resets, software help and Wi-Fi troubleshooting.</p>

            <Link to="/baseline/it" className="secondary-btn">
              Read More
            </Link>
          </div>

          {/* CONTACT */}
          <div className="service-card contact">
            <div className="icon">
              <PhoneCall size={32} />
            </div>

            <h3>Contact</h3>

            <p>Email, phone or visit the student support office.</p>

            <Link to="/baseline/contact" className="secondary-btn">
              Read More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
