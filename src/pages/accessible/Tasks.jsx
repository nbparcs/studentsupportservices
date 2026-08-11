import TaskCard from "../../components/TaskCard";

function Tasks() {
  return (
    <>
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
              You have an assignment due next week and need help improving your academic writing.
              "
              instruction="
              Find a student support service that can help with assignments.
              "
              link="/accessible/task/1"
            />
          </div>

          <div data-aoi="Accessible Counselling Task">
            <TaskCard
              title="Task 2 - Counselling Support"
              scenario="
              You are feeling stressed and need someone to talk to about your wellbeing.
              "
              instruction="
              Find a service that provides counselling support.
              "
              link="/accessible/task/2"
            />
          </div>

          <div data-aoi="Accessible Disability Task">
            <TaskCard
              title="Task 3 - Disability Support"
              scenario="
              You need learning adjustments and accessibility assistance.
              "
              instruction="
              Find the disability support service.
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
