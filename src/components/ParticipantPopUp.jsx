import { useRef, useState, useEffect } from "react";
import "../styles/ParticipantPopUp.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const initialQuestionnaire = {
  studentStatus: "",
  usingCorrectiveLenses: "",
  visionCorrectionType: "",
  computerType: "",
  universityWebsiteImportance: "",
};

const steps = ["Consent Form", "Vision and Participant Background"];

// Defined outside the main component so React does not remount
// every radio group each time the state changes.
function RadioQuestion({ title, field, options, value, onChange }) {
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
              checked={value === option}
              onChange={() => onChange(field, option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function ParticipantPopup({ onComplete }) {
  const [step, setStep] = useState(0);
  const [questionnaire, setQuestionnaire] = useState(initialQuestionnaire);
  const [consentGiven, setConsentGiven] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const popupContentRef = useRef(null);
  useEffect(() => {
    if (popupContentRef.current) {
      popupContentRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });
    }
  }, [step]);

  // Keeps the session if the questionnaire fails, so a retry
  // does not create a second session and participant code.
  const createdSessionRef = useRef(null);

  function updateAnswer(field, value) {
    setQuestionnaire((previous) => {
      const next = { ...previous, [field]: value };

      // Keep Questions 2 and 3 consistent.
      if (field === "usingCorrectiveLenses") {
        if (value === "No") {
          next.visionCorrectionType = "None";
        } else if (previous.visionCorrectionType === "None") {
          next.visionCorrectionType = "";
        }
      }

      return next;
    });
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
        "computerType",
        "universityWebsiteImportance",
      ];

      if (requiredFields.some((field) => !questionnaire[field])) {
        return "Please answer all five questions before submitting.";
      }

      if (questionnaire.studentStatus === "No") {
        return "This study is intended for currently enrolled tertiary students. You cannot proceed.";
      }

      if (
        questionnaire.usingCorrectiveLenses === "Yes" &&
        questionnaire.visionCorrectionType === "None"
      ) {
        return "Please select the type of vision correction you use.";
      }

      if (
        questionnaire.usingCorrectiveLenses === "No" &&
        questionnaire.visionCorrectionType !== "None"
      ) {
        return "If you will not be wearing eyeglasses or contact lenses, please select None for question 3.";
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
      let sessionId;
      let participantCode;

      if (createdSessionRef.current) {
        // Reuse the session created by an earlier attempt.
        ({ sessionId, participantCode } = createdSessionRef.current);
      } else {
        const sessionResponse = await fetch(`${API_URL}/sessions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        const sessionData = await sessionResponse.json();

        if (!sessionResponse.ok) {
          throw new Error(
            sessionData.error || "Could not create research session.",
          );
        }

        sessionId = Number(sessionData.sessionId);
        participantCode = sessionData.participantCode;

        if (!Number.isInteger(sessionId) || sessionId < 1) {
          throw new Error("Invalid session ID returned by server.");
        }

        if (typeof participantCode !== "string" || !participantCode) {
          throw new Error("Invalid participant code returned by server.");
        }

        createdSessionRef.current = { sessionId, participantCode };
      }

      // Save the five questionnaire responses.
      const questionnaireResponse = await fetch(
        `${API_URL}/participant-questionnaire`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            visionResponses: questionnaire,
            consentGiven,
          }),
        },
      );

      const questionnaireData = await questionnaireResponse.json();

      // 409 means this session's questionnaire is already saved,
      // so treat it as success.
      if (!questionnaireResponse.ok && questionnaireResponse.status !== 409) {
        throw new Error(
          [
            questionnaireData.error || "Could not save questionnaire.",
            ...(questionnaireData.details || []),
          ].join("\n"),
        );
      }

      // Store participant and session information.
      window.researchSessionId = sessionId;
      window.researchParticipantCode = participantCode;

      sessionStorage.setItem("researchParticipantCode", participantCode);
      sessionStorage.setItem("researchActiveSessionId", String(sessionId));
      sessionStorage.setItem("researchSessionId", String(sessionId));
      sessionStorage.setItem("researchConsentGiven", "true");

      console.log("Participant registered:", { participantCode, sessionId });

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

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <div className="participant-page">
            <span className="participant-eyebrow">
              STUDENT CONNECT RESEARCH STUDY
            </span>

            <h2>
              Research Title: Evaluating Web Design Accessibility Using
              Webcam-Based Eye Tracking Among Tertiary Students with and without
              Self-Reported Vision-Related Difficulties.
            </h2>

            <p>
              <strong>By:</strong> Nathalie Arcolas
            </p>

            <p className="participant-info-link">
              <a
                href="/research-information"
                target="_blank"
                rel="noopener noreferrer"
              >
                Click here to view the Participant Information Sheet ↗
              </a>
            </p>

            <hr />

            <h2>I. Consent Form</h2>

            <h3>Participant Consent</h3>

            <p>
              By ticking the checkbox, you confirm that you have read and
              understood the Participant Information Sheet, understand the
              purpose of the research and what participation involves,
              acknowledge that webcam-based eye tracking will estimate your gaze
              while you complete the website tasks, understand that
              participation is voluntary and that you may withdraw, and
              understand how your research data will be collected, used, stored
              and protected. You also confirm that you voluntarily agree to
              participate in this research study.
            </p>

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
              STEP 2 – QUESTIONNAIRE A
            </span>

            <h2>
              II. Questionnaire A - Vision and Participant Background
              Questionnaire
            </h2>

            <p>Please answer all five questions.</p>

            <RadioQuestion
              title="1. Are you currently enrolled in a university or another tertiary education institution?"
              field="studentStatus"
              options={["Yes", "No"]}
              value={questionnaire.studentStatus}
              onChange={updateAnswer}
            />

            <RadioQuestion
              title="2. Will you be wearing eyeglasses or contact lenses while completing this task to help you see or read the text clearly?"
              field="usingCorrectiveLenses"
              options={["Yes", "No"]}
              value={questionnaire.usingCorrectiveLenses}
              onChange={updateAnswer}
            />

            <RadioQuestion
              title="3. What type of vision correction do you use?"
              field="visionCorrectionType"
              options={[
                "Eyeglass (spectacles)",
                "Contact lenses",
                "Both glasses and corrective/contact lenses",
                "None",
              ]}
              value={questionnaire.visionCorrectionType}
              onChange={updateAnswer}
            />

            <RadioQuestion
              title="4. Will you be using a laptop or computer screen to do the experiment?"
              field="computerType"
              options={["Laptop", "Desktop computer"]}
              value={questionnaire.computerType}
              onChange={updateAnswer}
            />

            <RadioQuestion
              title="5. How important is a university website for you to find information about student services, such as academic support, IT support or disability support?"
              field="universityWebsiteImportance"
              options={[
                "Very important",
                "Important",
                "Less important",
                "Not important",
              ]}
              value={questionnaire.universityWebsiteImportance}
              onChange={updateAnswer}
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
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
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

        <main className="participant-content" ref={popupContentRef}>
          {renderStep()}
        </main>

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
