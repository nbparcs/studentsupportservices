import {
  Accessibility,
  FileCheck,
  BookOpenCheck,
  Check,
  UserStar,
} from "lucide-react";
import bookaLearningAdvisorImg from "../../assets/images/bookalearningadvisor.png";
import appguideImg from "../../assets/images/access_appguide.png";
import assistanceImg from "../../assets/images/access_assistance.png";
import assistivetechImg from "../../assets/images/access_assisttech.png";
import examarrangementsImg from "../../assets/images/access_examarrange.png";
import guideImg from "../../assets/images/access_guide.png";
import learningaccommodationsImg from "../../assets/images/access_learnaccomm.png";
import { Link } from "react-router-dom";
import disabilityheroImg from "../../assets/images/Disability_hero.png";

function Disability() {
  return (
    <>
      {/* HERO */}
      <section
        className="accessible-hero disability-hero"
        data-aoi="Disability Hero"
        style={{
          backgroundImage: `url(${disabilityheroImg})`,
        }}
      >
        <div className="accessible-hero-bg">
          <div className="accessible-circle accessible-circle-1"></div>
          <div className="accessible-circle accessible-circle-2"></div>
          <div className="accessible-grid"></div>
        </div>

        <div className="accessible-hero-content">
          <h1>
            Disability <span className="bold">Support</span>
          </h1>

          <p>
            Access accessibility services, learning accommodations and
            personalised support to help create an inclusive learning
            environment.
          </p>

          <a
            href="#support"
            className="accessible-primary-btn"
            data-aoi="Explore Disability Support Button"
          >
            Explore Support
          </a>
        </div>
      </section>

      {/* QUICK LINKS */}
      <section
        className="accessible-quicklinks"
        data-aoi="Disability Quick Links"
      >
        <h2>Quick Links</h2>

        <div className="quicklink-buttons">
          <a href="#" data-aoi="Book Appointment Quick Link">
            Book Appointment
          </a>
          <a href="#" data-aoi="Apply for Support Quick Link">
            Apply for Support
          </a>
          <a href="#" data-aoi="Contact Advisor Quick Link">
            Contact Advisor
          </a>
          <a href="#" data-aoi="View Resources Quick Link">
            View Resources
          </a>
        </div>
      </section>

      {/* SERVICES */}
      <section
        className="accessible-services"
        id="support"
        data-aoi="Disability Services"
      >
        <h2>Available Disability Support Services</h2>

        <div className="accessible-service-grid disability">
          <div
            className="accessible-card disability"
            data-aoi="Learning Accommodations"
          >
            <img
              src={learningaccommodationsImg}
              alt="Learning accommodations"
              className="service-image"
            />

            <h3>Learning Accommodations</h3>

            <p>
              Access note-taking assistance, alternative learning materials,
              assistive technologies, and personalised learning support.
            </p>
          </div>

          <div
            className="accessible-card disability"
            data-aoi="Exam Arrangements"
          >
            <img
              src={examarrangementsImg}
              alt="Exam arrangements"
              className="service-image"
            />

            <h3>Exam Arrangements</h3>

            <p>
              Apply for alternative examination arrangements such as extra time,
              separate rooms, rest breaks, or specialised equipment.
            </p>
          </div>

          <div
            className="accessible-card disability"
            data-aoi="Accessibility Assistance"
          >
            <img
              src={assistanceImg}
              alt="Accessibility assistance"
              className="service-image"
            />

            <h3>Accessibility Assistance</h3>

            <p>
              Meet with Disability Advisors to discuss accessibility needs and
              develop an individual support plan throughout your studies.
            </p>
          </div>
        </div>
      </section>

      {/* HOW WE SUPPORT */}
      <section
        className="accessible-support"
        data-aoi="Disability Appointment Preparation"
      >
        <h2>We can better support you if you have these ready</h2>

        <div className="support-columns">
          {/* BEFORE APPOINTMENT */}
          <div
            className="support-column before-support"
            data-aoi="Before Appointment"
          >
            <h3>Before Your Appointment</h3>

            <ul>
              <li>
                <span className="step-number">1</span>
                Identify your learning needs
              </li>

              <li>
                <span className="step-number">2</span>
                Prepare supporting documents
              </li>

              <li>
                <span className="step-number">3</span>
                Think about accommodations you may require
              </li>
            </ul>
          </div>

          {/* DURING APPOINTMENT */}
          <div
            className="support-column during-support"
            data-aoi="During Appointment"
          >
            <h3>During Your Appointment</h3>

            <ul>
              <li>
                <span className="step-number">1</span>
                Discuss your accessibility requirements
              </li>

              <li>
                <span className="step-number">2</span>
                Create a personalised support plan
              </li>

              <li>
                <span className="step-number">3</span>
                Explore available services
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* BOOK ADVISOR */}
      <section
        className="accessible-highlight disability"
        data-aoi="Book Disability Advisor"
      >
        <div className="highlight-content">
          <h2>Book a Disability Advisor</h2>

          <p>
            Meet with a Disability Advisor to discuss accessibility needs,
            learning accommodations and available support services. Appointments
            are available online or on campus.
          </p>

          <Link
            to="/accessible/AcademicAppointment"
            className="accessible-primary-btn disability"
            data-aoi="Book Disability Advisor Button"
          >
            Book Appointment
          </Link>
        </div>

        <div className="highlight-image">
          <img
            src={bookaLearningAdvisorImg}
            alt="Student meeting with a learning advisor"
          />
        </div>
      </section>

      {/* STUDENT RESOURCES */}
      <section
        className="accessible-resources"
        data-aoi="Disability Student Resources"
      >
        <h2>Student Resources</h2>

        <p>Helpful resources to support accessibility and learning.</p>

        <div className="resource-grid">
          <div className="resource-card" data-aoi="Accessibility Guide">
            <img
              src={guideImg}
              alt="Accessibility Guide"
              className="resource-image"
            />

            <p>Accessibility Guide</p>
          </div>

          <div
            className="resource-card"
            data-aoi="Accommodation Application Guide"
          >
            <img
              src={appguideImg}
              alt="Accommodation Application Guide"
              className="resource-image"
            />

            <p>Accommodation Application Guide</p>
          </div>

          <div
            className="resource-card"
            data-aoi="Assistive Technology Resources"
          >
            <img
              src={assistivetechImg}
              alt="Assistive Technology Resources"
              className="resource-image"
            />

            <p>Assistive Technology Resources</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="accessible-faq" data-aoi="Disability FAQ">
        <h2>Frequently Asked Questions (FAQ)</h2>

        <div data-aoi="Disability Eligibility FAQ">
          <strong>Q: Who can access Disability Support?</strong>

          <p>
            A: Students with disabilities, learning difficulties, health
            conditions, or accessibility needs.
          </p>
        </div>

        <div data-aoi="Disability Confidentiality FAQ">
          <strong>Q: Is my information confidential?</strong>

          <p>A: Yes. Student information is handled confidentially.</p>
        </div>

        <div data-aoi="Disability Registration Timing FAQ">
          <strong>Q: When should I register for support?</strong>

          <p>
            A: Students are encouraged to contact Disability Support as early as
            possible.
          </p>
        </div>
      </section>
    </>
  );
}

export default Disability;
