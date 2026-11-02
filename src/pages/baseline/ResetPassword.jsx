import { Dot } from "lucide-react";

function ResetPassword() {
  return (
    <>
      {/* HERO */}
      <section className="hero" data-aoi="Reset Password Hero">
        <div className="hero-bg">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="grid"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            Reset Your Student <span className="bold">Password</span>
          </h1>

          <p>
            Forgot your password or unable to access your account? Follow these
            steps to reset your password and regain access to your student
            services.
          </p>
        </div>
      </section>

      {/* RESET PASSWORD STEPS */}
      <section className="HowtoSteps" data-aoi="Password Reset Instructions">
        <h2>How to Reset Your Password</h2>

        <div className="HowtoStep" data-aoi="Password Reset Step 1">
          Step 1
          <p>
            Visit the password reset portal. Click Here
            www.resetpassword@studentconnect.nz
          </p>
        </div>

        <div className="HowtoStep" data-aoi="Password Reset Step 2">
          Step 2<p>Enter your student ID number and email address.</p>
        </div>

        <div className="HowtoStep" data-aoi="Password Reset Step 3">
          Step 3<p>Verify your identity using your registered details.</p>
        </div>

        <div className="HowtoStep" data-aoi="Password Reset Step 4">
          Step 4<p>Create a new password and sign in again.</p>
        </div>
      </section>

      {/* PASSWORD REQUIREMENTS */}
      <section
        className="PasswordRequirements"
        data-aoi="Password Requirements"
      >
        <div className="PasswordRequirement">
          <h2>Password Requirements</h2>
          <p>Your new password should include:</p>

          <ul>
            <li data-aoi="Minimum Password Length">
              <Dot size={20} />
              Include at least 8 characters
            </li>

            <li data-aoi="Uppercase and Lowercase Requirement">
              <Dot size={20} />
              Include uppercase and lowercase letters
            </li>

            <li data-aoi="Numbers and Symbols Requirement">
              <Dot size={20} />
              Include numbers or symbols
            </li>

            <li data-aoi="Personal Information Warning">
              <Dot size={20} />
              Avoid using personal information
            </li>
          </ul>
        </div>
      </section>

      {/* ADDITIONAL HELP */}
      <section className="needhelp" data-aoi="Password Reset Additional Help">
        <h2>Need Additional Help?</h2>

        <p>
          If you are still unable to access your account, contact the IT Service
          Desk for assistance.
        </p>

        <p className="helpinfo">
          <a href="#" data-aoi="IT Support Email">
            itsupport@student.edu
          </a>{" "}
          | 07 123 4567
        </p>
      </section>
    </>
  );
}

export default ResetPassword;
