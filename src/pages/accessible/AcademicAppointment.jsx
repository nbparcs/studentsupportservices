import "../../styles/AcademicAppointment.css";

function AcademicAppointment() {
  return (
    <>
      {/* HERO */}
      <section className="accessible-hero">
        <div className="accessible-hero-content">
          <h1>
            Book an <span className="bold">Appointment</span>
          </h1>

          <p>
            Request academic support and book an appointment with one of our
            Learning Advisors.
          </p>
        </div>
      </section>

      {/* FORM */}
      <section
        className="accessible-appointment"
        data-aoi="Accessible Appointment Page"
      >
        <div className="accessible-appointment-container">
          <h2>Learning Support Appointment</h2>

          <p>
            Complete the form below to request assistance with assignments,
            academic writing, study skills, or referencing. A Learning Advisor
            will contact you to confirm your appointment.
          </p>

          <form data-aoi="Accessible Appointment Form">
            <div className="form-messageus">
              <label>
                Student Name <span>(*Required)</span>
              </label>

              <input type="text" placeholder="Enter your full name" />
            </div>

            <div className="form-messageus">
              <label>
                Student ID <span>(*Required)</span>
              </label>

              <input type="text" placeholder="Enter your student ID" />
            </div>

            <div className="form-messageus">
              <label>
                Email Address <span>(*Required)</span>
              </label>

              <input type="email" placeholder="Enter your email address" />
            </div>

            <div className="form-messageus">
              <label>Reason for Appointment</label>

              <textarea
                rows="5"
                placeholder="Briefly describe what you would like help with..."
              />
            </div>

            <div className="form-messageus">
              <label>Preferred Appointment Date</label>

              <input type="date" />
            </div>

            <button type="submit" className="appointment-submit-btn">
              Submit Request
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default AcademicAppointment;
