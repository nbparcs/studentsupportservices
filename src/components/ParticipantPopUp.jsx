import { useState } from "react";
import "../styles/ParticipantPopUp.css";

const API_URL = "http://localhost:3001/api";

const initialQuestionnaire = {
  studentStatus: "",
  usingCorrectiveLenses: "",
  visionCorrectionType: "",
  universityWebsiteImportance: "",
};

const steps = ["Research Information & Consent", "Participant Background"];

export default function ParticipantPopup({ onComplete }) {
  const [step, setStep] = useState(0);
  const [questionnaire, setQuestionnaire] = useState(initialQuestionnaire);
  const [consentGiven, setConsentGiven] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateAnswer(field, value) {
    setQuestionnaire((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function validateStep() {
    if (step === 0 && !consentGiven) {
      return "Please read and agree to the consent statement before continuing.";
    }

    if (step === 1) {
      const requiredFields = [
        "studentStatus",
        "usingCorrectiveLenses",
        "visionCorrectionType",
        "universityWebsiteImportance",
      ];

      if (requiredFields.some((field) => !questionnaire[field])) {
        return "Please answer all four questions before continuing.";
      }

      if (questionnaire.studentStatus === "No") {
        return "This study is intended for currently enrolled tertiary students. You cannot proceed.";
      }
    }

    return "";
  }

  function nextStep() {
    const validationError = validateStep();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setStep(1);
  }

  function previousStep() {
    setError("");
    setStep(0);
  }

  async function handleSubmit() {
    const validationError = validateStep();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!consentGiven) {
      setError("Consent is required before registration.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      // Create research session
      const sessionResponse = await fetch(`${API_URL}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const sessionData = await sessionResponse.json();

      if (!sessionResponse.ok) {
        throw new Error(
          sessionData.error || "Could not create research session.",
        );
      }

      const sessionId = Number(sessionData.sessionId);
      const participantCode = sessionData.participantCode;

      if (!Number.isInteger(sessionId) || sessionId < 1) {
        throw new Error("Invalid session ID returned by server.");
      }

      if (typeof participantCode !== "string" || !participantCode) {
        throw new Error("Invalid participant code returned by server.");
      }

      // Save the four questionnaire responses
      const questionnaireResponse = await fetch(
        `${API_URL}/participant-questionnaire`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            visionResponses: questionnaire,
            consentGiven,
          }),
        },
      );

      const questionnaireData = await questionnaireResponse.json();

      if (!questionnaireResponse.ok) {
        throw new Error(
          [
            questionnaireData.error || "Could not save questionnaire.",
            ...(questionnaireData.details || []),
          ].join("\n"),
        );
      }

      // Store participant and session information
      window.researchSessionId = sessionId;
      window.researchParticipantCode = participantCode;

      sessionStorage.setItem("researchParticipantCode", participantCode);
      sessionStorage.setItem("researchActiveSessionId", String(sessionId));
      sessionStorage.setItem("researchSessionId", String(sessionId));
      sessionStorage.setItem("researchConsentGiven", "true");

      console.log("Participant registered:", {
        participantCode,
        sessionId,
      });

      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      console.error("Participant registration error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function RadioQuestion({ title, field, options }) {
    return (
      <fieldset className="participant-question">
        <legend>{title}</legend>

        <div className="participant-options">
          {options.map((option) => (
            <label key={option} className="participant-option">
              <input
                type="radio"
                name={field}
                value={option}
                checked={questionnaire[field] === option}
                onChange={() => updateAnswer(field, option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <div className="participant-page">
            <span className="participant-eyebrow">
              STUDENT CONNECT RESEARCH STUDY
            </span>

            <h2>
              Evaluating Web Design Accessibility Using Webcam-Based Eye
              Tracking Among Tertiary Students with and without Self-Reported
              Vision-Related Difficulties
            </h2>

            <p>
              <strong>Researcher:</strong> Nathalie Arcolas
            </p>

            <p>
              <a href="/research-information">
                Click here for more information about the research
              </a>
            </p>

            <hr />

            <h2>Consent Form</h2>

            <h3>Participant Consent</h3>

            <p>By ticking the checkbox below, you confirm that:</p>

            <ul>
              <li>
                You have read and understood the Participant Information Sheet.
              </li>
              <li>
                You understand the purpose of the research and what
                participation involves.
              </li>
              <li>
                You understand that webcam-based eye tracking will estimate your
                gaze while completing the website tasks.
              </li>
              <li>
                You understand that participation is voluntary and that
                withdrawal is subject to the conditions explained in the
                information sheet.
              </li>
              <li>
                You understand how your research data will be collected, used,
                stored and protected.
              </li>
              <li>
                You voluntarily agree to participate in this research study.
              </li>
            </ul>

            <label className="participant-consent">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(event) => setConsentGiven(event.target.checked)}
              />

              <span>
                I have read and understood the information above, and I agree to
                participate in this research study.
              </span>
            </label>

            <p className="participant-hint">
              You must provide consent to proceed. If you do not wish to
              participate, you may close this registration window.
            </p>
          </div>
        );

      case 1:
        return (
          <div className="participant-page">
            <span className="participant-eyebrow">
              STEP 2 – PARTICIPANT BACKGROUND
            </span>

            <h2>Participant Background</h2>

            <p>Please answer the following four questions.</p>

            <RadioQuestion
              title="1. Are you currently enrolled in a university or another tertiary education institution?"
              field="studentStatus"
              options={["Yes", "No"]}
            />

            <RadioQuestion
              title="2. Will you be using glasses or corrective lenses to complete this task?"
              field="usingCorrectiveLenses"
              options={["Yes", "No"]}
            />

            <RadioQuestion
              title="3. What eye-correcting aid will you be using?"
              field="visionCorrectionType"
              options={[
                "Eyeglasses",
                "Corrective/contact lenses",
                "Both glasses and corrective/contact lenses",
                "None",
              ]}
            />

            <RadioQuestion
              title="4. How important is a university website for you to find information about student services, such as academic support, IT support or disability support?"
              field="universityWebsiteImportance"
              options={[
                "Very important",
                "Important",
                "Less important",
                "Not important",
              ]}
            />
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="participant-popup-backdrop">
      <section
        className="participant-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="participant-popup-title"
      >
        <header className="participant-header">
          <div>
            <span className="participant-brand">STUDENT CONNECT</span>

            <h2 id="participant-popup-title">
              Research Participant Registration
            </h2>
          </div>
        </header>

        <div className="participant-progress">
          <div className="participant-progress-label">
            <span>{steps[step]}</span>
            <span>
              {step + 1} of {steps.length}
            </span>
          </div>

          <div className="participant-progress-track">
            <div
              className="participant-progress-fill"
              style={{
                width: `${((step + 1) / steps.length) * 100}%`,
              }}
            />
          </div>

          <div className="participant-step-labels">
            {steps.map((name, index) => (
              <span key={name} className={index <= step ? "active" : ""}>
                {index + 1}
              </span>
            ))}
          </div>
        </div>

        <main className="participant-content">{renderStep()}</main>

        <footer className="participant-footer">
          {error && (
            <p className="participant-error" role="alert">
              {error}
            </p>
          )}

          <div className="participant-footer-buttons">
            {step > 0 && (
              <button
                type="button"
                className="participant-back"
                onClick={previousStep}
                disabled={saving}
              >
                Back
              </button>
            )}

            <button
              type="button"
              className="participant-next"
              onClick={step === 0 ? nextStep : handleSubmit}
              disabled={saving}
            >
              {saving
                ? "Submitting..."
                : step === 1
                  ? "Submit and Continue"
                  : "Continue"}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
