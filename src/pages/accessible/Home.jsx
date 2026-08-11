import { Link } from "react-router-dom";
import {
  GraduationCap,
  HeartHandshake,
  Accessibility,
  BriefcaseBusiness,
  Laptop,
  PhoneCall,
} from "lucide-react";

import homeheroImg from "../../assets/images/Home_hero.png";

function Home() {
  return (
    <>
      {/* ACCESSIBLE HERO SECTION */}
      {/* ACCESSIBLE HERO */}
      <section
        className="accessible-hero home-hero"
        data-aoi="hero"
        style={{
          backgroundImage: `url(${homeheroImg})`,
        }}
      >
        {/* Background graphics */}
        <div className="accessible-hero-bg">
          <div className="accessible-circle accessible-circle-1"></div>
          <div className="accessible-circle accessible-circle-2"></div>
          <div className="accessible-grid"></div>
        </div>

        <div className="accessible-hero-content">
          <h1>
            Welcome to <span className="bold">Student Connect</span>
          </h1>

          <p>
            A student support services platform that helps students easily
            access academic, wellbeing, career, IT and accessibility support in
            one place.
          </p>

          <Link to="/accessible/about" className="accessible-primary-btn">
            Read More
          </Link>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="accessible-services">
        <h2>Student Support Services</h2>

        <div className="accessible-service-grid">
          {/* Academic */}
          <div className="accessible-card academic" data-aoi="academic-support">
            <div className="accessible-icon">
              <GraduationCap size={32} />
            </div>

            <h3>Academic Support</h3>

            <p>Study workshops, learning advisors, assignment assistance.</p>
            <Link to="/accessible/academic">Learn More</Link>
          </div>

          {/* Counselling */}
          <div className="accessible-card counselling">
            <div className="accessible-icon">
              <HeartHandshake size={32} />
            </div>

            <h3>Counselling</h3>
            <p>Confidential mental health support and wellbeing resources.</p>

            <Link to="/accessible/counselling">Learn More</Link>
          </div>

          {/* Disability */}
          <div
            className="accessible-card disability"
            data-aoi="Disability Support Card"
          >
            <div className="accessible-icon">
              <Accessibility size={32} />
            </div>

            <h3>Disability Support</h3>

            <p>
              Learning accommodations, accessibility assistance and exam
              support.
            </p>

            <Link to="/accessible/disability">Learn More</Link>
          </div>

          {/* Career */}
          <div className="accessible-card career">
            <div className="accessible-icon">
              <BriefcaseBusiness size={32} />
            </div>

            <h3>Career Services</h3>
            <p>CV reviews, interview preparation and job search support.</p>

            <Link to="/accessible/career">Learn More</Link>
          </div>

          {/* IT */}
          <div className="accessible-card it" data-aoi="it-support">
            <div className="accessible-icon">
              <Laptop size={32} />
            </div>

            <h3>IT Support</h3>

            <p>Password resets, software help and Wi-Fi troubleshooting.</p>

            <Link to="/accessible/it">Learn More</Link>
          </div>

          {/* Contact */}
          <div className="accessible-card contact">
            <div className="accessible-icon">
              <PhoneCall size={32} />
            </div>

            <h3>Contact</h3>

            <p>Email, phone or visit the student support office.</p>

            <Link to="/accessible/contact">Learn More</Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
