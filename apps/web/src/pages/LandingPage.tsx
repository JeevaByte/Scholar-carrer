import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="grid" style={{ gap: "1.3rem" }}>
      <section className="hero">
        <h1>Making High-Stakes Opportunities Visible and Equitable Globally.</h1>
        <p>
          Discover scholarships, fellowships, and career milestones curated for your unique journey.
        </p>
        <Link to="/opportunities" className="primary-btn">
          Find Opportunities
        </Link>
      </section>

      <section className="grid cards">
        <article className="card">
          <h3>Discover</h3>
          <p>Smart matching algorithms surface high-value opportunities tailored to your profile.</p>
        </article>
        <article className="card">
          <h3>Apply</h3>
          <p>Manage applications with integrated timelines, checklist tracking, and strategy notes.</p>
        </article>
        <article className="card">
          <h3>Succeed</h3>
          <p>Connect milestones with mentor support and long-term career outcomes.</p>
        </article>
      </section>
    </div>
  );
}
