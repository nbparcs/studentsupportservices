import React from "react";
import "../styles/ParticipantInformation.css";
import logo from "../assets/studentconnect_logo.png";

function ParticipantInformation() {
  return (
    <div className="information-sheet">
      <header className="information-header">
        <div className="information-brand">
          <img src={logo} alt="Student Connect" className="information-logo" />
        </div>

        <span className="information-research-label">
          COMP903 Information Technology Applied Research Project
        </span>
      </header>

      <main className="information-container">
        <div className="information-intro">
          <span className="information-tag">RESEARCH INFORMATION SHEET</span>

          <h1>Participant Information</h1>

          <h2>
            Evaluating Web Design Accessibility Using Webcam-Based Eye Tracking
            Among Tertiary Students with and without Self-Reported
            Vision-Related Difficulties
          </h2>

          <div className="information-researcher-details">
            <p>
              <strong>Researcher:</strong> Nathalie Bliss P. Arcolas
            </p>
            <p>
              <strong>Application:</strong> Student Connect
            </p>
            <p>
              <strong>Institution:</strong> Auckland Institute of Studies (AIS)
            </p>
            <p>
              <strong>Programme:</strong> Master of Information Technology
            </p>
          </div>
        </div>

        <section className="information-section">
          <h3>Welcome!</h3>
          <p>
            Hi! I am Nathalie Bliss P. Arcolas, and I am conducting this
            research for COMP903 – Information Technology Applied Research
            Project as part of my Master of Information Technology qualification
            at the Auckland Institute of Studies (AIS).
          </p>
        </section>

        <section className="information-section">
          <h3>1. What is the purpose of this research?</h3>
          <p>
            The purpose of this study is to investigate how
            accessibility-focused web design relates to visual attention and
            task performance among users with and without self-reported
            vision-related difficulties.
          </p>
          <p>
            The study uses webcam-based eye-tracking technology to examine how
            participants interact with a university student support website. The
            study will collect information such as task completion time,
            estimated time to first fixation, fixation duration, and gaze
            positions in specific areas of the website.
          </p>
          <p>
            This information will help compare how participants interact with
            the two website designs and identify differences between the two
            participant groups.
          </p>
        </section>

        <section className="information-section">
          <h3>2. Why are you invited to participate?</h3>
          <p>
            You are invited to participate in a study investigating how
            different website designs influence visual attention, task
            performance, and usability among tertiary students with and without
            self-reported vision-related difficulties.
          </p>
          <p>
            The study uses a web-based eye-tracking tool called
            <strong> WebGazer.js</strong>.
          </p>
          <p>
            Participation is voluntary, and you may choose not to participate
            without penalty or disadvantage.
          </p>
        </section>

        <section className="information-section">
          <h3>3. What will happen if I participate?</h3>
          <p>
            The study uses two versions of the Student Connect website: Baseline
            and Accessible. You will be asked to complete three short tasks on
            each website while using a webcam-based eye-tracking tool called
            WebGazer.js.
          </p>
          <p>
            An enabled webcam is required to estimate your eye gaze while you
            interact with the websites.
          </p>
          <p>The study will collect information such as:</p>
          <ul>
            <li>Task completion time</li>
            <li>Task success</li>
            <li>Estimated time to first fixation</li>
            <li>Fixation duration</li>
            <li>Gaze positions inside and outside areas of interest</li>
            <li>Post-task usability questionnaire responses</li>
          </ul>
          <p>
            This information will help compare how participants interact with
            the two website designs and identify differences between the two
            participant groups.
          </p>
        </section>

        <section className="information-section">
          <h3>4. What are the risks or concerns?</h3>
          <p>
            No significant risks are anticipated. Participation involves looking
            at a computer screen, completing website tasks, and answering survey
            questions.
          </p>
          <p>
            You may experience minor eye strain or discomfort from looking at a
            screen. You may take a break or stop participating if you feel
            uncomfortable.
          </p>
        </section>

        <section className="information-section">
          <h3>5. What are the benefits?</h3>
          <p>
            You may not receive direct personal benefit from participating.
            However, the findings may help inform future decisions about
            accessible website design and inclusive student support services.
          </p>
        </section>

        <section className="information-section">
          <h3>6. How will my privacy be protected?</h3>
          <p>
            Your research data will be handled confidentially and used for the
            purposes described in the approved research protocol.
          </p>
          <p>
            Your webcam will be used to estimate your gaze position, but webcam
            video or images will not be intentionally stored as research data.
            Only the relevant eye-tracking measurements and task results will be
            collected and analysed.
          </p>
        </section>

        <section className="information-section">
          <h3>7. Is participation voluntary?</h3>
          <p>
            Your participation is entirely voluntary. You may decline to
            participate or withdraw in accordance with the withdrawal
            arrangements explained in the approved information sheet.
          </p>
          <p>
            The information sheet will explain whether data already collected
            can be removed and when removal may no longer be possible.
          </p>
        </section>

        <section className="information-section">
          <h3>8. How much time will participation take?</h3>
          <p>
            The study involves completing six tasks across two interface
            designs, with three tasks on each website, along with the consent
            process and any required eye-tracking preparation.
          </p>
        </section>

        <section className="information-section information-contact-section">
          <h3>9. Who can I contact?</h3>

          <div className="information-contact-card">
            <p>
              <strong>Researcher</strong>
            </p>
            <p>Nathalie Bliss P. Arcolas</p>
            <a href="mailto:20250549@aisstudent.ac.nz">
              20250549@aisstudent.ac.nz
            </a>
          </div>

          <div className="information-contact-card">
            <p>
              <strong>Project Supervisor</strong>
            </p>
            <p>Rakesh Kumar</p>
            <a href="mailto:Rakesh.Kumar@ais.ac.nz">Rakesh.Kumar@ais.ac.nz</a>
          </div>
        </section>

        <footer className="information-footer">
          <div className="information-footer">
            <p>Thank you for taking the time to read this information.</p>

            <button
              type="button"
              className="information-back-button"
              onClick={() => window.close()}
            >
              Close This Tab
            </button>

            <p className="information-footer-note">
              If this tab does not close, please return to the original tab to
              continue with the consent form.
            </p>
          </div>

          <p className="information-footer-note">
            Student Connect | COMP903 Information Technology Applied Research
            Project
          </p>
        </footer>
      </main>
    </div>
  );
}

export default ParticipantInformation;
