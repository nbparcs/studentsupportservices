import { useContext, useState } from "react";
import { TaskContext } from "../Context/TaskContext.jsx";
import "../styles/FeedbackSurvey.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const initialResponses = {
  // Eye tracking technical feedback
  cameraMesh: "",
  calibrationDot: "",
  baselineDotMoved: "",
  accessibleDotMoved: "",
  dotDisappeared: "",
  dotStoppedFollowing: "",
  otherProblems: "",
  problemDescription: "",

  // Baseline website
  baselineTextSize: "",
  baselineFont: "",
  baselineFindInfo: "",
  baselineHeadings: "",
  baselineDistinguishText: "",
  baselineDistinguishButtons: "",
  baselinePleasant: "",
  baselineComfortable: "",

  // Accessible website
  accessibleTextSize: "",
  accessibleFont: "",
  accessibleFindInfo: "",
  accessibleHeadings: "",
  accessibleDistinguishText: "",
  accessibleDistinguishButtons: "",
  accessiblePleasant: "",
  accessibleComfortable: "",

  // Overall preference
  preferredVersion: "",
  preferenceReason: "",
};

const yesNoNotSure = ["Yes", "No", "Not sure"];
const frequencyOptions = ["Never", "Once", "More than once", "Not sure"];

const technicalQuestions = [
  {
    field: "cameraMesh",
    question:
      "Before starting the website tasks, was your camera turned on, and could you see your face with the small mesh (lines and dots) over it in the camera box on the left side of the screen?",
    options: yesNoNotSure,
  },
  {
    field: "calibrationDot",
    question:
      "Before starting the website tasks, could you see the large red dot appearing on the screen and click it as instructed until it disappeared?",
    options: yesNoNotSure,
  },
  {
    field: "baselineDotMoved",
    question:
      "While completing the three tasks on the Baseline website, did the small red dot move around the screen as you looked at different parts of the website?",
    options: yesNoNotSure,
  },
  {
    field: "accessibleDotMoved",
    question:
      "While completing the three tasks on the Accessible website, did the small red dot move around the screen as you looked at different parts of the website?",
    options: yesNoNotSure,
  },
  {
    field: "dotDisappeared",
    question:
      "While completing the six website tasks, how often did the small red dot disappear or stop moving?",
    options: frequencyOptions,
  },
  {
    field: "dotStoppedFollowing",
    question:
      "While completing the six website tasks, how often did the small red dot stop following where you were looking on the screen?",
    options: frequencyOptions,
  },
];

const scale = [
  "1 – Strongly disagree",
  "2 – Disagree",
  "3 – Neutral",
  "4 – Agree",
  "5 – Strongly agree",
];

const websiteSections = [
  {
    id: "baseline",
    title: "A. Baseline Website",
    groups: [
      {
        heading: "Text Readability",
        items: [
          {
            field: "baselineTextSize",
            text: "The text size on the Baseline website was easy to read.",
          },
          {
            field: "baselineFont",
            text: "The font size and style made reading comfortable.",
          },
        ],
      },
      {
        heading: "Layout and Visual Hierarchy",
        items: [
          {
            field: "baselineFindInfo",
            text: "Important information was easy to find on the Baseline website.",
          },
          {
            field: "baselineHeadings",
            text: "Headings helped me understand how information was organised.",
          },
        ],
      },
      {
        heading: "Colour and Contrast",
        items: [
          {
            field: "baselineDistinguishText",
            text: "The text was easy to distinguish from the background.",
          },
          {
            field: "baselineDistinguishButtons",
            text: "I could easily distinguish buttons and links from other content.",
          },
        ],
      },
      {
        heading: "User Experience",
        items: [
          {
            field: "baselinePleasant",
            text: "I found the Baseline website pleasant to use.",
          },
          {
            field: "baselineComfortable",
            text: "I felt comfortable exploring the Baseline website.",
          },
        ],
      },
    ],
  },
  {
    id: "accessible",
    title: "B. Accessible Website",
    groups: [
      {
        heading: "Text Readability",
        items: [
          {
            field: "accessibleTextSize",
            text: "The text on the Accessible website was easy to read.",
          },
          {
            field: "accessibleFont",
            text: "The font size and style made reading comfortable.",
          },
        ],
      },
      {
        heading: "Layout and Visual Hierarchy",
        items: [
          {
            field: "accessibleFindInfo",
            text: "Important information was easy to find on the Accessible website.",
          },
          {
            field: "accessibleHeadings",
            text: "Headings helped me understand how information was organised.",
          },
        ],
      },
      {
        heading: "Colour and Contrast",
        items: [
          {
            field: "accessibleDistinguishText",
            text: "The text was easy to distinguish from the background.",
          },
          {
            field: "accessibleDistinguishButtons",
            text: "I could easily distinguish buttons and links from other content.",
          },
        ],
      },
      {
        heading: "User Experience",
        items: [
          {
            field: "accessiblePleasant",
            text: "I found the Accessible website pleasant to use.",
          },
          {
            field: "accessibleComfortable",
            text: "I felt comfortable exploring the Accessible website.",
          },
        ],
      },
    ],
  },
];

const requiredTasks = [
  "Baseline-1",
  "Baseline-2",
  "Baseline-3",
  "Accessible-1",
  "Accessible-2",
  "Accessible-3",
];

function FeedbackSurvey() {
  const { completedTasks } = useContext(TaskContext);

  const [responses, setResponses] = useState(initialResponses);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Identify each task by both its interface and task ID.
  const completed = new Set(
    completedTasks.map((task) => `${task.interface}-${task.id}`),
  );

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
      const sessionId =
        completedTasks[0]?.sessionId ||
        sessionStorage.getItem("researchSessionId");

      if (!sessionId) {
        throw new Error("Research session ID not found.");
      }

      const response = await fetch(`${API_URL}/participant-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: Number(sessionId),
          feedbackResponses: responses,
        }),
      });

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
          {/* EYE TRACKING TECHNICAL FEEDBACK */}
          <section className="feedback-section">
            <h3>Eye Tracking Technical Feedback Questionnaire</h3>

            {technicalQuestions.map((item, index) => (
              <div className="feedback-question" key={item.field}>
                <p>
                  <strong>{index + 1}.</strong> {item.question}
                </p>
                {renderOptions(item.field, item.options)}
              </div>
            ))}

            <div className="feedback-question">
              <p>
                <strong>{technicalQuestions.length + 1}.</strong> Did you
                experience any other problems with the camera, the red dot, or
                the website while completing the six tasks?
              </p>
              {renderOptions("otherProblems", ["No", "Yes"])}

              <label className="feedback-label" htmlFor="problemDescription">
                If yes, please describe the problem below.
              </label>

              <textarea
                id="problemDescription"
                value={responses.problemDescription}
                onChange={(e) =>
                  handleChange("problemDescription", e.target.value)
                }
                rows={3}
                placeholder="Describe any problems you experienced..."
              />
            </div>
          </section>

          {/* WEBSITE USABILITY FEEDBACK */}
          <section className="feedback-section">
            <h3>Website Usability Feedback</h3>

            <p className="feedback-instructions">
              Please rate the following statements based on your experience with
              using both versions.
            </p>

            <p className="feedback-scale">
              Response scale: 1 – Strongly disagree | 2 – Disagree | 3 – Neutral
              | 4 – Agree | 5 – Strongly agree
            </p>

            {websiteSections.map((section) => {
              let questionNumber = 0;

              return (
                <div key={section.id} className="feedback-website">
                  <h4>{section.title}</h4>

                  {section.groups.map((group) => (
                    <div key={group.heading} className="feedback-group">
                      <h5>{group.heading}</h5>

                      {group.items.map((item) => {
                        questionNumber += 1;

                        return (
                          <div className="feedback-question" key={item.field}>
                            <p>
                              <strong>{questionNumber}.</strong> {item.text}
                            </p>
                            {renderOptions(item.field, scale)}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              );
            })}

            {/* OVERALL PREFERENCE */}
            <div className="feedback-website">
              <h4>C. Overall Preference</h4>

              <div className="feedback-question">
                <p>
                  <strong>1.</strong> Which version of the Student Connect
                  website would you prefer to use?
                </p>
                {renderOptions("preferredVersion", [
                  "Baseline website",
                  "Accessible website",
                  "No preference",
                ])}
              </div>

              <div className="feedback-question">
                <p>
                  <strong>2.</strong> Why do you prefer this version? (Optional)
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
            </div>
          </section>

          {error && (
            <p className="feedback-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="feedback-submit" disabled={saving}>
            {saving ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FeedbackSurvey;
