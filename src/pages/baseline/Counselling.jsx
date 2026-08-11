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
      <section className="hero">
        <div className="hero-bg">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="grid"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            <span className="light">Counselling</span>{" "}
            <span className="bold">Services</span>
          </h1>

          <p>
            Your wellbeing matters. Access confidential counselling, mental
            health support, and wellbeing resources to help you thrive during
            your studies.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services">
        <h2>Available Support</h2>

        <div className="service-grid">
          <div className="service-card counselling">
            <div className="icon">
              <HeartHandshake size={30} />
            </div>

            <h3>One-on-One Counselling</h3>

            <p>
              Speak privately with a qualified counsellor about personal,
              academic, or emotional challenges.
            </p>

            <a href="#" className="secondary-btn">
              Learn More
            </a>
          </div>

          <div className="service-card counselling">
            <div className="icon">
              <CalendarCheck size={30} />
            </div>

            <h3>Book an Appointment</h3>

            <p>
              Schedule a counselling session at a time that suits your
              timetable.
            </p>

            <a href="#" className="secondary-btn">
              Learn More
            </a>
          </div>

          <div className="service-card counselling">
            <div className="icon">
              <MessageCircle size={30} />
            </div>

            <h3>Wellbeing Resources</h3>

            <p>
              Explore articles, self-help tools, and stress management resources
              available to students.
            </p>

            <a href="#" className="secondary-btn">
              Learn More
            </a>
          </div>

          <div className="service-card counselling">
            <div className="icon">
              <ShieldCheck size={30} />
            </div>

            <h3>Crisis Support</h3>

            <p>
              Learn about emergency contacts and immediate support services
              available when urgent help is needed.
            </p>

            <a href="#" className="secondary-btn">
              Learn More
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Counselling;
