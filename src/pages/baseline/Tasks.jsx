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
            You have an assignment due next week and need help improving your academic writing.
            "
            instruction="
            Find a student support service that can help with assignments.
            "
            link="/baseline/task/1"
          />

          <TaskCard
            title="Task 2 - Counselling Support"
            scenario="
            You are feeling stressed and need someone to talk to about your wellbeing.
            "
            instruction="
            Find a service that provides counselling support.
            "
            link="/baseline/task/2"
          />

          <TaskCard
            title="Task 3 - Disability Support"
            scenario="
            You need learning adjustments and accessibility assistance.
            "
            instruction="
            Find the disability support service.
            "
            link="/baseline/task/3"
          />
        </div>
      </section>
    </>
  );
}

export default Tasks;
