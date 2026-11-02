import TaskCard from "../../components/TaskCard";

function Tasks() {
  return (
    <>
      {/* TASK HERO */}
      <section className="tasks-hero" data-aoi="Tasks Hero">
        <div className="tasks-hero-content">
          <h1>Experiment Tasks</h1>

          <p>
            Complete the following tasks by navigating through Student Connect
            and finding the support services described in each scenario.
          </p>
        </div>
      </section>

      {/* TASK LIST */}
      <section className="tasks-page">
        <div className="task-list">
          <TaskCard
            title="Task 1 - Academic Support"
            scenario="
            You have an assignment due next week and would like help improving your academic writing.
            "
            instruction="
            Find a way to book a free session with a Learning Advisor for help with your assignment.
            "
            link="/baseline/task/1"
          />

          <TaskCard
            title="Task 2 - Disability Support"
            scenario="
            You think you may need disability support at university and want to know when you should register.
            "
            instruction="
            Find out when students are encouraged to register for Disability Support.
            "
            link="/baseline/task/2"
          />

          <TaskCard
            title="Task 3 - IT Support"
            scenario="
            You are trying to reset your university password, but your new password is not being accepted.
            "
            instruction="
            Find out what requirements your new password must meet so you can reset it successfully.
            "
            link="/baseline/task/3"
          />
        </div>
      </section>
    </>
  );
}

export default Tasks;
