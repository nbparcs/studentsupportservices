import TaskCard from "../../components/TaskCard";
import FeedbackSurvey from "../../components/FeedbackSurvey";

function Tasks() {
  return (
    <>
      <FeedbackSurvey />
      {/* ACCESSIBLE TASK HERO */}
      <section
        className="accessible-tasks-hero"
        data-aoi="Accessible Tasks Hero"
      >
        <div className="accessible-tasks-hero-content">
          <h1>Experiment Tasks</h1>

          <p>
            Complete each task by following the instructions provided and
            finding the appropriate student support service.
          </p>
        </div>
      </section>

      {/* TASK LIST */}
      <section className="accessible-tasks-page">
        <div className="accessible-task-list">
          <div data-aoi="Accessible Academic Task">
            <TaskCard
              title="Task 1 - Academic Support"
              scenario="
              You have an assignment due next week and would like help improving your academic writing.
              "
              instruction="
              Find a way to book a free session with a Learning Advisor for help with your assignment.
              "
              link="/accessible/task/1"
            />
          </div>

          <div data-aoi="Accessible Disability Task">
            <TaskCard
              title="Task 2 - Disability Support"
              scenario="
              You think you may need disability support at university and want to know when you should register.
              "
              instruction="
              Find out when students are encouraged to register for Disability Support.
              "
              link="/accessible/task/2"
            />
          </div>

          <div data-aoi="Accessible IT Task">
            <TaskCard
              title="Task 3 - IT Support"
              scenario="
              You are trying to reset your university password, but your new password is not being accepted.
              "
              instruction="
              Find out what requirements your new password must meet so you can reset it successfully.
              "
              link="/accessible/task/3"
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default Tasks;
