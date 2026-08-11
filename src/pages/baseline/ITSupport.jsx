import { KeyRound, Laptop, Wifi } from "lucide-react";
import { Link } from "react-router-dom";

function IT() {
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
            <span className="bold">IT Support</span>
          </h1>

          <p>
            Get technical assistance with your student accounts, software,
            devices, and campus technology services to support your learning.
          </p>
        </div>
      </section>

      {/*Quick Links*/}
      <section className="quicklinks">
        <h2>Quick Links</h2>

        <div className="qlinks">
          <a href="#">Reset Password </a>
          <a href="#">Software Support </a>
          <a href="#">Wi-Fi Help</a>
          <a href="#">Device Support</a>
        </div>
      </section>

      {/* CONTENT */}
      <section className="services">
        <h2>Available IT Services</h2>

        <div className="service-grid">
          <div className="service-card">
            <div className="icon it">
              <KeyRound size={32} />
            </div>

            <h3>Password Assistance</h3>

            <p>
              Reset your student password, unlock your account, and receive
              support with account access issues.
            </p>

            <Link to="/baseline/resetpassword" className="service-btn">
              Learn More
            </Link>
          </div>

          <div className="service-card">
            <div className="icon it">
              <Laptop size={32} />
            </div>

            <h3>Software Support</h3>

            <p>
              Get help installing university software, Microsoft 365, learning
              applications, and other academic tools.
            </p>

            <Link to="#" className="service-btn">
              Learn More
            </Link>
          </div>

          <div className="service-card">
            <div className="icon it">
              <Wifi size={32} />
            </div>

            <h3>Wi-Fi & Device Support</h3>

            <p>
              Connect your laptop or mobile device to the campus Wi-Fi and
              troubleshoot network or hardware issues.
            </p>

            <Link to="#" className="service-btn">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="needhelp">
        <h2>Need technical assistance?</h2>
        <p>
          Our IT Support team can help with account access, software, devices,
          and campus technology.
        </p>
        <p className="helpinfo">
          <a href="#">itsupport@student.edu</a> | 07 123 4567
        </p>
      </section>

      <section className="letusknowform">
        <div className="letusknow_container">
          <h2>Or Let us know how we can help</h2>

          <form>
            <div className="form-messageus">
              <label>
                Name <span>(*Required)</span>
              </label>
              <input type="text" placeholder="Enter your Name" />
            </div>

            <div className="form-messageus">
              <label>Email</label>
              <input type="email" placeholder="Enter your Email" />
            </div>

            <div className="form-messageus">
              <label>Student ID</label>
              <input type="text" placeholder="Enter your Student ID" />
            </div>

            <div className="form-messageus">
              <label>Description of the problem</label>
              <textarea
                rows="5"
                placeholder="Describe your issue in detail..."
              ></textarea>
            </div>

            <button type="submit" className="appointment-submit-btn">
              Submit Request
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default IT;
