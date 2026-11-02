import { Laptop, KeyRound, Wifi, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import ITSoftwareImg from "../../assets/images/access_ITSoftwareSupport.png";
import PasswordAssistanceImg from "../../assets/images/access_PassAssist.png";
import WifiSupportImg from "../../assets/images/access_Wifi.png";
import ITSupportheroImg from "../../assets/images/ITSupport_hero.png";

function IT() {
  return (
    <>
      {/* HERO */}
      <section
        className="accessible-hero itsupport-hero"
        data-aoi="IT Hero"
        style={{
          backgroundImage: `url(${ITSupportheroImg})`,
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
            IT <span className="bold">Support</span>
          </h1>

          <p>
            Get technical assistance with software, accounts, devices and
            digital services to support your learning experience.
          </p>

          <a
            href="#support"
            className="accessible-primary-btn"
            data-aoi="Explore IT Support Button"
          >
            Explore Support
          </a>
        </div>
      </section>

      {/* SERVICES */}
      <section
        className="accessible-services"
        id="support"
        data-aoi="IT Services"
      >
        <h2>IT Services</h2>

        <div className="accessible-service-grid it">
          {/* Password Assistance */}
          <div className="accessible-card it" data-aoi="Password Assistance">
            <img
              src={PasswordAssistanceImg}
              alt="Password assistance"
              className="service-image"
            />

            <h3>Password Assistance</h3>

            <p>
              Reset your student password, unlock your account, and receive
              support with account access issues.
            </p>

            <Link
              to="/accessible/resetpassword"
              className="service-btn"
              data-aoi="Password Assistance Learn More"
            >
              Learn More
            </Link>
          </div>

          {/* Software Support */}
          <div className="accessible-card it" data-aoi="Software Support">
            <img
              src={ITSoftwareImg}
              alt="Software support"
              className="service-image"
            />

            <h3>Software Support</h3>

            <p>
              Get help installing university software, Microsoft 365, learning
              applications, and other academic tools.
            </p>

            <a href="#" data-aoi="Software Support Read More">
              Read More
            </a>
          </div>

          {/* Wi-Fi Support */}
          <div
            className="accessible-card it"
            data-aoi="WiFi and Device Support"
          >
            <img
              src={WifiSupportImg}
              alt="Wi-Fi support"
              className="service-image"
            />

            <h3>Wi-Fi Troubleshooting</h3>

            <p>
              Connect your laptop or mobile device to the campus Wi-Fi and
              troubleshoot network or hardware issues.
            </p>

            <a href="#" data-aoi="WiFi Support Read More">
              Read More
            </a>
          </div>
        </div>
      </section>

      {/* NEED HELP */}
      <section className="accessible-it-help" data-aoi="IT Contact Information">
        <h2>Need technical assistance?</h2>

        <p>
          Our IT Support team can help with account access, software, devices,
          and campus technology.
        </p>

        <p className="it-help-info">
          <a href="#" data-aoi="IT Support Email">
            itsupport@student.edu
          </a>{" "}
          | 07 123 4567
        </p>
      </section>

      {/* IT SUPPORT FORM */}
      <section
        className="accessible-letusknow"
        data-aoi="IT Support Request Form"
      >
        <div className="accessible-letusknow-container">
          <h2>Or Let us know how we can help</h2>

          <form>
            <div
              className="accessible-form-message"
              data-aoi="IT Request Name Field"
            >
              <label>
                Name <span>(*Required)</span>
              </label>

              <input type="text" placeholder="Enter your Name" />
            </div>

            <div
              className="accessible-form-message"
              data-aoi="IT Request Email Field"
            >
              <label>Email</label>

              <input type="email" placeholder="Enter your Email" />
            </div>

            <div
              className="accessible-form-message"
              data-aoi="IT Request Student ID Field"
            >
              <label>Student ID</label>

              <input type="text" placeholder="Enter your Student ID" />
            </div>

            <div
              className="accessible-form-message"
              data-aoi="IT Request Description Field"
            >
              <label>Description of the problem</label>

              <textarea
                rows="5"
                placeholder="Describe your issue in detail..."
              ></textarea>
            </div>

            <button
              className="accessible-submit-btn"
              data-aoi="IT Request Submit Button"
            >
              Submit Request
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default IT;
