import { KeyRound, Laptop, Wifi } from "lucide-react";
import { Link } from "react-router-dom";

function IT() {
  return (
    <>
      {/* HERO */}
      <section className="hero" data-aoi="IT Hero">
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

      {/* QUICK LINKS */}
      <section className="quicklinks" data-aoi="IT Quick Links">
        <h2>Quick Links</h2>

        <div className="qlinks">
          <Link
            to="/baseline/resetpassword"
            data-aoi="Reset Password Quick Link"
          >
            Reset Password
          </Link>
          <a href="#" data-aoi="Software Support Quick Link">
            Software Support
          </a>
          <a href="#" data-aoi="WiFi Help Quick Link">
            Wi-Fi Help
          </a>
          <a href="#" data-aoi="Device Support Quick Link">
            Device Support
          </a>
        </div>
      </section>

      {/* CONTENT */}
      <section className="services" data-aoi="IT Services">
        <h2>Available IT Services</h2>

        <div className="service-grid">
          {/* PASSWORD ASSISTANCE */}
          <div className="service-card" data-aoi="Password Assistance">
            <div className="icon it">
              <KeyRound size={32} />
            </div>

            <h3>Password Assistance</h3>

            <p>
              Reset your student password, unlock your account, and receive
              support with account access issues.
            </p>

            <Link
              to="/baseline/resetpassword"
              className="service-btn"
              data-aoi="Password Assistance Learn More"
            >
              Learn More
            </Link>
          </div>

          {/* SOFTWARE SUPPORT */}
          <div className="service-card" data-aoi="Software Support">
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

          {/* WIFI AND DEVICE SUPPORT */}
          <div className="service-card" data-aoi="WiFi and Device Support">
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

      {/* CONTACT INFORMATION */}
      <section className="needhelp" data-aoi="IT Contact Information">
        <h2>Need technical assistance?</h2>
        <p>
          Our IT Support team can help with account access, software, devices,
          and campus technology or any other IT related issues.
        </p>

        <p className="helpinfo">
          <a href="#" data-aoi="IT Support Email">
            itsupport@student.edu
          </a>{" "}
          | or call 07 123 4567 for urgent issues.
        </p>
      </section>

      {/* CONTACT FORM */}
      <section className="letusknowform" data-aoi="IT Support Request Form">
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
