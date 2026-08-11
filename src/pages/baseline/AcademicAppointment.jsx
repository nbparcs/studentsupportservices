import "../../styles/AcademicAppointment.css";

function AcademicAppointment() {
  return (
    <>
      {/* HERO */}
      <section className="hero" data-aoi="Appointment Hero">
        <div className="hero-content">
          <h1>
            Book an <span className="bold">Appointment</span>
          </h1>

          <p>
            Request academic support and book an appointment with our student
            support team.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section className="appointment-form-container" id="appointment">
        <h2>Assignment Assistance</h2>

        <p>
          Receive support with understanding assessment requirements, planning
          and improving assignment quality.
        </p>

        <form data-aoi="Appointment Form">
          <div className="form-group">
            <label>Student Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              data-aoi="Student Name"
            />
          </div>

          <div className="form-group">
            <label>Student ID</label>
            <input
              type="text"
              placeholder="Enter your student ID"
              data-aoi="Student ID"
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              data-aoi="Email"
            />
          </div>

          <div className="form-group">
            <label>Reason for Appointment</label>
            <textarea
              rows="5"
              placeholder="Describe your enquiry"
              data-aoi="Reason"
            />
          </div>

          <div className="form-group">
            <label>Preferred Appointment Date</label>
            <input type="date" data-aoi="Appointment Date" />
          </div>

          <button
            type="submit"
            className="appointment-submit-btn"
            data-aoi="Submit Appointment"
          >
            Submit Request
          </button>
        </form>
      </section>
    </>
  );
}

export default AcademicAppointment;
