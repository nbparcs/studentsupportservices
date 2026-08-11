import { Mail, Phone, MapPin } from "lucide-react";

function Contact() {
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
            <span className="bold">Contact Us</span>
          </h1>

          <p>
            Have questions or need assistance? Our support team is here to help
            you connect with the right services and resources.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="services">
        <h2>Get In Touch</h2>

        <div className="service-grid">
          {/* Email */}
          <div className="service-card">
            <div className="icon contact">
              <Mail size={32} />
            </div>

            <h3>Email Support</h3>

            <p>
              Send us an email for general enquiries, support requests, or
              information about available student services.
            </p>
          </div>

          {/* Phone */}
          <div className="service-card">
            <div className="icon contact">
              <Phone size={32} />
            </div>

            <h3>Phone Assistance</h3>

            <p>
              Contact our support team directly for immediate assistance and
              guidance with your enquiries.
            </p>
          </div>

          {/* Location */}
          <div className="service-card">
            <div className="icon contact">
              <MapPin size={32} />
            </div>

            <h3>Visit Us</h3>

            <p>
              Visit our student support centre to speak with a staff member and
              access personalised assistance.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Contact;
