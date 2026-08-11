function About() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="grid"></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            <span className="light">About</span>{" "}
            <span className="bold">Student Connect</span>
          </h1>

          <p>
            Learn more about the purpose of Student Connect and how it helps
            students easily access university support services.
          </p>
        </div>
      </section>

      {/* ABOUT CONTENT */}
      <section className="services">
        <div
          className="service-card"
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "40px",
          }}
        >
          <h2>Welcome to Student Connect</h2>

          <p>
            Student Connect is a prototype web application designed to bring
            together a range of university support services into one simple,
            accessible platform. Instead of searching through multiple webpages,
            students can quickly find important services such as Academic
            Support, Counselling, Disability Services, Career Development, IT
            Support, and Contact Information from a single location.
          </p>

          <p>
            The website has been designed with accessibility and ease of
            navigation in mind. Clear layouts, consistent page structures, and
            intuitive navigation help students locate the information they need
            with minimal effort. The prototype also serves as the platform for
            an eye-tracking study using WebGazer.js, allowing researchers to
            investigate how different website designs influence users'
            navigation behaviour, visual attention, and overall usability.
          </p>

          <p>
            Student Connect aims to provide a user-friendly experience that
            supports students in accessing essential services efficiently while
            exploring how accessible interface design can improve engagement and
            information discovery.
          </p>
        </div>
      </section>
    </>
  );
}

export default About;
