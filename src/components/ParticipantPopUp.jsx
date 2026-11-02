import { useState } from "react";
import "../styles/ParticipantPopUp.css";

const API_URL = "http://localhost:3001/api";

const ageGroups = [
  { value: "18-25", label: "18–25 years" },
  { value: "26-35", label: "26–35 years" },
  { value: "36+", label: "36 years or older" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const visionOptions = [
  "Yes, frequently",
  "Yes, sometimes",
  "No, never",
  "Not sure",
  "None of the above",
  "Prefer not to say",
];

export default function ParticipantPopup({ onComplete }) {
  const [ageGroup, setAgeGroup] = useState("");
  const [visionResponses, setVisionResponses] = useState([]);
  const [consentGiven, setConsentGiven] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function toggleVision(option) {
    setVisionResponses((previous) => {
      if (previous.includes(option)) {
        return previous.filter((item) => item !== option);
      }

      if (option === "None of the above" || option === "Prefer not to say") {
        return [option];
      }

      return [
        ...previous.filter(
          (item) =>
            item !== "None of the above" && item !== "Prefer not to say",
        ),
        option,
      ];
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!ageGroup) {
      setError("Please select your age group.");
      return;
    }

    if (visionResponses.length !== 1) {
      setError("Please select one answer about your vision.");
      return;
    }

    if (!consentGiven) {
      setError("You must provide consent before continuing.");
      return;
    }

    setSaving(true);

    try {
      // Create a session. The backend should generate the participant code.
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

      const sessionId = Number(sessionData.sessionId);
      const participantCode = sessionData.participantCode;

      if (!Number.isInteger(sessionId) || sessionId < 1) {
        throw new Error("The server did not return a valid session ID.");
      }

      if (typeof participantCode !== "string" || !participantCode) {
        throw new Error("The server did not return a participant code.");
      }

      // Save the questionnaire against this session.
      const questionnaireResponse = await fetch(
        `${API_URL}/participant-questionnaire`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            ageGroup,
            visionResponses,
            consentGiven,
          }),
        },
      );

      const questionnaireData = await questionnaireResponse.json();

      if (!questionnaireResponse.ok) {
        throw new Error(
          questionnaireData.error ||
            `Questionnaire save failed: HTTP ${questionnaireResponse.status}`,
        );
      }

      window.researchSessionId = sessionId;
      window.researchParticipantCode = participantCode;

      // Store the participant code.
      sessionStorage.setItem("researchParticipantCode", participantCode);

      // Store the session ID using the key expected by researchApi.js.
      sessionStorage.setItem("researchActiveSessionId", String(sessionId));

      // Keep the existing key if other components use it.
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
      console.error("Participant questionnaire error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
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
        <h2 id="participant-popup-title">Research Participant Information</h2>

        <p>Please complete this questionnaire before beginning the study.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="ageGroup">Age group</label>
          <select
            id="ageGroup"
            value={ageGroup}
            onChange={(event) => setAgeGroup(event.target.value)}
            required
          >
            <option value="">Select your age group</option>
            {ageGroups.map((group) => (
              <option key={group.value} value={group.value}>
                {group.label}
              </option>
            ))}
          </select>

          <fieldset>
            <legend>
              Do you have trouble seeing text or small details on a computer
              screen without using corrective lenses (glasses or contact
              lenses)?
            </legend>

            <p className="popup-hint">Please select one answer.</p>

            {visionOptions.map((option) => (
              <label className="popup-checkbox" key={option}>
                <input
                  type="radio"
                  name="visionResponse"
                  checked={visionResponses.includes(option)}
                  onChange={() => setVisionResponses([option])}
                  required
                />
                <span>{option}</span>
              </label>
            ))}
          </fieldset>

          <label className="popup-checkbox consent-checkbox">
            <input
              type="checkbox"
              checked={consentGiven}
              onChange={(event) => setConsentGiven(event.target.checked)}
              required
            />
            <span>
              I have read the approved participant information and agree to
              participate in this study.
            </span>
          </label>

          {error && (
            <p className="popup-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Submit and Continue"}
          </button>
        </form>
      </section>
    </div>
  );
}
