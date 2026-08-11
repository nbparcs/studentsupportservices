import {
  HeartHandshake,
  CalendarCheck,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";

function Counselling() {
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
            Counselling <span className="bold">Support</span>
          </h1>

          <p>
            Your wellbeing matters. Access confidential counselling, mental
            health support, and wellbeing resources to help you thrive during
            your studies.
          </p>

          <a href="#support" className="accessible-primary-btn">
            Explore Support
          </a>
        </div>
      </section>

      {/* SERVICES */}
      <section className="accessible-services" id="support">
        <h2>Counselling Services</h2>

        <div className="accessible-service-grid">
          {/* Mental Health Support */}
          <div className="accessible-card counselling">
            <div className="accessible-icon">
              <HeartHandshake size={32} />
            </div>

            <h3>One-on-One Counselling</h3>

            <p>
              Speak privately with a qualified counsellor about personal,
              academic, or emotional challenges.
            </p>

            <a href="#">Read More</a>
          </div>

          {/* Wellbeing Resources */}
          <div className="accessible-card counselling">
            <div className="accessible-icon">
              <CalendarCheck size={30} />
            </div>

            <h3>Book an Appointment</h3>

            <p>
              Schedule a counselling session at a time that suits your
              timetable.
            </p>

            <a href="#">Book Now</a>
          </div>

          <div className="accessible-card counselling">
            <div className="accessible-icon">
              <MessageCircle size={30} />
            </div>

            <h3>Wellbeing Resources</h3>

            <p>
              Explore articles, self-help tools, and stress management resources
              available to students.
            </p>

            <a href="#">Read More</a>
          </div>

          <div className="accessible-card counselling">
            <div className="accessible-icon">
              <ShieldCheck size={30} />
            </div>

            <h3>Crisis Support</h3>

            <p>
              Learn about emergency contacts and immediate support services
              available when urgent help is needed.
            </p>

            <a href="#">Read More</a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Counselling;
