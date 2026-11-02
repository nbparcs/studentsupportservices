import { Link } from "react-router-dom";
import {
  Accessibility,
  BookOpenCheck,
  FileCheck,
  ClipboardList,
  Check,
  BookText,
  UserStar,
  NotepadText,
  House,
  Laptop,
} from "lucide-react";

function Disability() {
  return (
    <>
      {/* HERO */}
      <section className="hero" data-aoi="Disability Hero">
        <div className="hero-bg">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="grid"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Disability <span className="bold">Support</span>
          </h1>

          <p>
            We are committed to creating an inclusive learning environment by
            providing accessibility services, learning accommodations, and
            personalised support for students with disabilities.
          </p>
        </div>
      </section>

      {/*Quick Links*/}
      <section className="quicklinks" data-aoi="Disability Quick Links">
        <h2>Quick Links</h2>

        <div className="qlinks">
          <a href="#"> Book Appointment </a>
          <a href="#"> Apply for Support</a>
          <a href="#"> Contact Advisor </a>
          <a href="#"> View Resources</a>
        </div>
      </section>

      {/* CONTENT */}
      <section className="services" data-aoi="Disability Services">
        <h2>Available Disability Support Services</h2>

        <div className="service-grid">
          {/* Learning Accommodations */}
          <div className="service-card" data-aoi="Learning Accommodations">
            <div className="icon disability">
              <BookOpenCheck size={32} />
            </div>

            <h3>Learning Accommodations</h3>

            <p>
              Access note-taking assistance, alternative learning materials,
              assistive technologies, and personalised learning support.
            </p>
          </div>

          {/* Exam Arrangements */}
          <div className="service-card" data-aoi="Exam Arrangements">
            <div className="icon disability">
              <ClipboardList size={32} />
            </div>

            <h3>Exam Arrangements</h3>

            <p>
              Apply for alternative examination arrangements such as extra time,
              separate rooms, rest breaks, or specialised equipment.
            </p>
          </div>

          {/* Accessibility Assistance */}
          <div className="service-card">
            <div className="icon disability">
              <FileCheck size={32} />
            </div>

            <h3>Accessibility Assistance</h3>

            <p>
              Meet with Disability Advisors to discuss accessibility needs and
              develop an individual support plan throughout your studies.
            </p>
          </div>
        </div>
      </section>

      <section
        className="howtosupport"
        data-aoi="Disability Appointment Preparation"
      >
        <h2>We can better support you if you have these ready</h2>

        <div className="support-columns">
          <div className="support-column" data-aoi="Before Appointment">
            <h3>Before Your Appointment</h3>
            <ul>
              <li>
                <Check size={18} />
                Identify your learning needs
              </li>
              <li>
                <Check size={18} />
                Prepare any supporting documents
              </li>
              <li>
                <Check size={18} />
                Think about the accommodations you may require
              </li>
            </ul>
          </div>

          <div className="support-column" data-aoi="During Appointment">
            <h3>During Your Appointment</h3>
            <ul>
              <li>
                {" "}
                <Check size={18} />
                Discuss your accessibility requirements
              </li>
              <li>
                <Check size={18} />
                Create a personalized support plan
              </li>
              <li>
                <Check size={18} />
                Explore available services
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section
        className="MeetDisabilityAdvisor"
        data-aoi="Learning Advisor Section"
      >
        <div className="learn-icon">
          <UserStar size={70} />
        </div>

        <h2>Book a Learning Advisor</h2>
        <p>
          Meet with a Learning Advisor for free to discuss your assignment or
          improve your academic writing. Session duration will be 30–60 minutes,
          located at Student Learning Centre or Online, from Monday to Friday
          9-5PM and for FREE.
        </p>
        <Link
          className="baseline-primary-btn"
          data-aoi="Book Learning Support Button"
        >
          Book Learning Support
        </Link>
      </section>

      {/*Student Resources*/}
      <section
        className="StudentResources"
        data-aoi="Disability Student Resources"
      >
        <h2>Student Resources</h2>
        <h4>Helpful resources to support your studies</h4>

        <div className="studentresourcecolumns">
          <div className="studentresourcecolumn" data-aoi="Accessibility Guide">
            <div className="src_icon">
              <NotepadText size={20} />
              <p>Accessibility Guide</p>
            </div>
          </div>

          <div
            className="studentresourcecolumn"
            data-aoi="Accommodation Application Guide"
          >
            <div className="src_icon">
              <House size={20} />
              <p>Accommodation Application Guide</p>
            </div>
          </div>

          <div
            className="studentresourcecolumn"
            data-aoi="Assistive Technology Resources"
          >
            <div className="src_icon">
              <Laptop size={20} />
              <p>Assistive Technology Resources</p>
            </div>
          </div>
        </div>
      </section>

      <section className="StudentResourcesFAQ" data-aoi="Disability FAQ">
        <h2>Frequently Asked Questions (FAQ)</h2>
        <div className="SRFAQ" data-aoi="FAQ Access Disability Support">
          Q: Who can access Disability Support?
          <p>
            A: Students with disabilities, learning difficulties, health
            conditions, or accessibility needs.
          </p>
        </div>

        <div className="SRFAQ" data-aoi="FAQ Confidentiality">
          Q: Is my information confidential?
          <p>A: Yes. Student information is handled confidentially.</p>
        </div>

        <div className="SRFAQ" data-aoi="FAQ Registration Timing">
          Q: When should I register for support?
          <p>
            A: We encourage students to contact Disability Support as early as
            possible so their needs can be discussed and appropriate support or
            learning adjustments can be arranged.
          </p>
        </div>
      </section>
    </>
  );
}

export default Disability;
