import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import ITSupportheroImg from "../../assets/images/ITSupport_hero.png";

function ResetPassword() {
  return (
    <>
      {/* HERO */}
      <section
        className="accessible-hero itsupport-hero"
        style={{
          backgroundImage: `url(${ITSupportheroImg})`,
        }}
      >
        <div className="accessible-hero-bg">
          <div className="accessible-circle accessible-circle-1"></div>
          <div className="accessible-circle accessible-circle-2"></div>
          <div className="accessible-grid"></div>
        </div>

        <div className="accessible-hero-content">
          <h1>
            Reset Your Student <span className="bold">Password</span>
          </h1>

          <p>
            Forgot your password or unable to access your account? Follow these
            steps to reset your password and regain access to your student
            services.
          </p>
        </div>
      </section>

      {/* RESET STEPS */}
      <section className="password-steps">
        <h2>How to Reset Your Password</h2>

        <div className="password-step">
          <div className="step-number">1</div>

          <div className="step-content">
            <h3>Step 1</h3>

            <p>
              Visit the password reset portal.
              <br />
              <a href="#" className="reset-link">
                www.resetpassword@studentconnect.nz
              </a>
            </p>
          </div>
        </div>

        <div className="password-step">
          <div className="step-number">2</div>

          <div className="step-content">
            <h3>Step 2</h3>

            <p>Enter your student ID number and email address.</p>
          </div>
        </div>

        <div className="password-step">
          <div className="step-number">3</div>

          <div className="step-content">
            <h3>Step 3</h3>

            <p>Verify your identity using your registered details.</p>
          </div>
        </div>

        <div className="password-step">
          <div className="step-number">4</div>

          <div className="step-content">
            <h3>Step 4</h3>

            <p>Create a new password and sign in again.</p>
          </div>
        </div>

        {/* PASSWORD REQUIREMENTS */}
        <div className="password-step">
          <div className="step-number requirements-number">
            <ShieldAlert size={32} />
          </div>

          <div className="step-content">
            <h3>Password Requirements</h3>

            <p>Your new password should include:</p>

            <ul className="password-list">
              <li>At least 8 characters</li>
              <li>Uppercase and lowercase letters</li>
              <li>Numbers or symbols</li>
              <li>Avoid using personal information</li>
            </ul>
          </div>
        </div>
      </section>

      {/* HELP */}
      <section className="accessible-contact">
        <h2>Need Additional Help?</h2>

        <p>
          If you are still unable to access your account, contact the IT Service
          Desk for assistance.
        </p>

        <p className="helpinfo">
          <a href="#">itsupport@student.edu</a> | 07 123 4567
        </p>
      </section>
    </>
  );
}

export default ResetPassword;
