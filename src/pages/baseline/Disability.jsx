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
      <section className="hero">
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
      <section className="quicklinks">
        <h2>Quick Links</h2>

        <div className="qlinks">
          <a href="#"> Book Appointment </a>
          <a href="#"> Apply for Support</a>
          <a href="#"> Contact Advisor </a>
          <a href="#"> View Resources</a>
        </div>
      </section>

      {/* CONTENT */}
      <section className="services">
        <h2>Available Disability Support Services</h2>

        <div className="service-grid">
          {/* Learning Accommodations */}
          <div className="service-card">
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
          <div className="service-card">
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

      <section className="howtosupport">
        <h2>We can better support you if you have these ready</h2>

        <div className="support-columns">
          <div className="support-column">
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

          <div className="support-column">
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
      <section className="MeetDisabilityAdvisor">
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
        <Link className="baseline-primary-btn">Book Learning Support</Link>
      </section>

      {/*Student Resources*/}
      <section className="StudentResources">
        <h2>Student Resources</h2>
        <h4>Helpful resources to support your studies</h4>

        <div className="studentresourcecolumns">
          <div className="studentresourcecolumn">
            <div className="src_icon">
              <NotepadText size={20} />
              <p>Accessibility Guide</p>
            </div>
          </div>

          <div className="studentresourcecolumn">
            <div className="src_icon">
              <House size={20} />
              <p>Accommodation Application Guide</p>
            </div>
          </div>

          <div className="studentresourcecolumn">
            <div className="src_icon">
              <Laptop size={20} />
              <p>Assistive Technology Resources</p>
            </div>
          </div>
        </div>
      </section>

      <section className="StudentResourcesFAQ">
        <h2>Frequently Asked Questions (FAQ)</h2>
        <div className="SRFAQ">
          Q: Who can access Disability Support?
          <p>
            A: Students with disabilities, learning difficulties, health
            conditions, or accessibility needs.
          </p>
        </div>

        <div className="SRFAQ">
          Q: Is my information confidential?
          <p>A: Yes. Student information is handled confidentially.</p>
        </div>

        <div className="SRFAQ">
          Q: When should I register for support?
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
