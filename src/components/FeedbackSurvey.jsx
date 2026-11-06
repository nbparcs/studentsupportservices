import { useContext, useState } from "react";
import { TaskContext } from "../Context/TaskContext.jsx";
import "../styles/FeedbackSurvey.css";

function FeedbackSurvey() {
  const [submitted, setSubmitted] = useState(false);

  const initialResponses = {
    calibration: "",
    gazeIndicator: "",
    trackingInterruptions: "",
    experiencedProblems: "",
    problemDescription: "",
    easeOfUse: "",
    findingInformation: "",
    layout: "",
    readability: "",
    preferredVersion: "",
    preferenceReason: "",
  };
  const { completedTasks } = useContext(TaskContext);

  const [responses, setResponses] = useState(initialResponses);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Identify each task by both its interface and task ID.
  const completed = new Set(
    completedTasks.map((task) => `${task.interface}-${task.id}`),
  );

  const requiredTasks = [
    "Baseline-1",
    "Baseline-2",
    "Baseline-3",
    "Accessible-1",
    "Accessible-2",
    "Accessible-3",
  ];

  const allTasksCompleted = requiredTasks.every((task) => completed.has(task));

  // Do not show the survey until all six tasks are completed.
  if (!allTasksCompleted) return null;

  const handleChange = (field, value) => {
    setResponses((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  if (submitted) {
    return (
      <div className="feedback-overlay">
        <div className="feedback-modal">
          <h2>Thank You!</h2>
          <p>
            Your feedback has been submitted successfully. You have completed
            the research study.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    setSaving(true);
    setError("");

    try {
      const sessionId = completedTasks[0]?.sessionId;

      if (!sessionId) {
        throw new Error("Research session ID not found.");
      }

      const response = await fetch(
        "http://localhost:3001/api/participant-feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: Number(sessionId),
            feedbackResponses: responses,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not save feedback.");
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Feedback submission failed:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const renderOptions = (field, options) => (
    <div className="feedback-options">
      {options.map((option) => (
        <label key={option}>
          <input
            type="radio"
            name={field}
            value={option}
            checked={responses[field] === option}
            onChange={() => handleChange(field, option)}
            required
          />
          {option}
        </label>
      ))}
    </div>
  );

  const scale = [
    "1 – Strongly disagree",
    "2 – Disagree",
    "3 – Neither agree nor disagree",
    "4 – Agree",
    "5 – Strongly agree",
  ];

  return (
    <div className="feedback-overlay">
      <div className="feedback-modal">
        <div className="feedback-header">
          <h2>Study Completed!</h2>
          <p>
            You have successfully completed all six research tasks. Please
            complete this short feedback survey.
          </p>
          <div className="feedback-progress">6 of 6 tasks completed</div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* TECHNICAL FEEDBACK */}
          <section className="feedback-section">
            <h3>Part A – Eye Tracking Technical Feedback</h3>

            <div className="feedback-question">
              <p>
                <strong>1.</strong> Was the calibration process completed
                successfully?
              </p>
              {renderOptions("calibration", ["Yes", "No", "Not sure"])}
            </div>

            <div className="feedback-question">
              <p>
                <strong>2.</strong> Before starting the research tasks, was the
                gaze indicator visible and updating as expected?
              </p>
              {renderOptions("gazeIndicator", ["Yes", "No", "Not sure"])}
            </div>

            <div className="feedback-question">
              <p>
                <strong>3.</strong> During the research tasks, how often did the
                gaze indicator disappear or stop updating?
              </p>
              {renderOptions("trackingInterruptions", [
                "Never",
                "Once",
                "More than once",
                "Not sure",
              ])}
            </div>

            <div className="feedback-question">
              <p>
                <strong>4.</strong> Did you experience any other problems with
                calibration, gaze tracking or using the website?
              </p>
              {renderOptions("experiencedProblems", ["No", "Yes"])}

              <label className="feedback-label">
                If yes, please describe the problem (optional).
              </label>

              <textarea
                value={responses.problemDescription}
                onChange={(e) =>
                  handleChange("problemDescription", e.target.value)
                }
                rows={3}
                placeholder="Describe any problems you experienced..."
              />
            </div>
          </section>

          {/* WEBSITE USABILITY */}
          <section className="feedback-section">
            <h3>Part B – Website Usability and Comparison</h3>

            <p className="feedback-instructions">
              Please rate the following statements based on your experience
              using both versions.
            </p>

            <p className="feedback-scale">
              1 – Strongly disagree | 2 – Disagree | 3 – Neither agree nor
              disagree | 4 – Agree | 5 – Strongly agree
            </p>

            {[
              {
                field: "easeOfUse",
                question:
                  "1. The Baseline version was easier to use than the Accessible version.",
              },
              {
                field: "findingInformation",
                question:
                  "2. The Accessible version made it easier to find information than the Baseline version.",
              },
              {
                field: "layout",
                question:
                  "3. The Accessible version had a layout that was easier to understand and follow than the Baseline version.",
              },
              {
                field: "readability",
                question:
                  "4. The Accessible version had text that was easier to read than the Baseline version.",
              },
            ].map((item) => (
              <div className="feedback-question" key={item.field}>
                <p>{item.question}</p>
                {renderOptions(item.field, scale)}
              </div>
            ))}

            <div className="feedback-question">
              <p>
                <strong>5.</strong> Overall, which version would you prefer to
                use for accessing student services?
              </p>
              {renderOptions("preferredVersion", [
                "Baseline",
                "Accessible",
                "No preference",
              ])}
            </div>

            <div className="feedback-question">
              <p>
                <strong>6.</strong> Why did you choose this version? (Optional)
              </p>

              <textarea
                value={responses.preferenceReason}
                onChange={(e) =>
                  handleChange("preferenceReason", e.target.value)
                }
                rows={3}
                placeholder="Share your reasons..."
              />
            </div>
          </section>

          {error && <p className="feedback-error">{error}</p>}

          <button type="submit" className="feedback-submit" disabled={saving}>
            {saving ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FeedbackSurvey;
