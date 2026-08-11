import { PhoneCall, Mail, MapPin, MessageCircle } from "lucide-react";

function Contact() {
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
            Contact <span className="bold">Student Support</span>
          </h1>

          <p>
            Reach out to the student support team through email, phone or
            in-person assistance.
          </p>

          <a href="#support" className="accessible-primary-btn">
            Contact Us
          </a>
        </div>
      </section>

      {/* SERVICES */}
      <section className="accessible-services" id="support">
        <h2>Contact Services</h2>

        <p className="section-description">
          Choose the best way to connect with student support services.
        </p>

        <div className="accessible-service-grid">
          {/* Email Support */}
          <div className="accessible-card contact">
            <div className="accessible-icon">
              <Mail size={32} />
            </div>

            <h3>Email Support</h3>

            <p>
              Send enquiries and receive assistance from the student support
              team through email communication.
            </p>

            <a href="#">Read More</a>
          </div>

          {/* Phone Support */}
          <div className="accessible-card contact">
            <div className="accessible-icon">
              <PhoneCall size={32} />
            </div>

            <h3>Phone Enquiries</h3>

            <p>
              Contact the support team directly for quick assistance with your
              questions and concerns.
            </p>

            <a href="#">Read More</a>
          </div>

          {/* Visit Student Services */}
          <div className="accessible-card contact">
            <div className="accessible-icon">
              <MapPin size={32} />
            </div>

            <h3>Visit Student Services</h3>

            <p>
              Visit the student services office for face-to-face support and
              personalised assistance.
            </p>

            <a href="#">Read More</a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
