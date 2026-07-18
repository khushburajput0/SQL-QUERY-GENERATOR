import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Home.css";

const capabilityCards = [
  {
    title: "Natural language to SQL",
    text: "Turn plain English requests into structured query options that are ready to review."
  },
  {
    title: "Your real database",
    text: "Connect with a PostgreSQL URL or credentials so AI works from your actual schema."
  },
  {
    title: "Explain and optimize",
    text: "Review explanations, risk signals, row impact, and optimization ideas before execution."
  }
];

function Landing() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="landing-page">
        <section className="landing-hero">
          <div className="hero-content">
            <p className="eyebrow">AI-powered database assistant</p>
            <h1>Generate reliable SQL from everyday language.</h1>
            <p className="hero-copy">
              A professional query generation workspace for teams that need
              faster database exploration, safer query review, and clearer SQL
              understanding.
            </p>

            <div className="hero-actions">
              <Link to="/home" className="primary-action">
                Open Workspace
              </Link>
              <Link to="/history" className="secondary-action">
                View History
              </Link>
            </div>
          </div>

          <div className="hero-panel" aria-label="SQL generation preview">
            <div className="panel-topbar">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="prompt-preview">
              Show customers with delayed orders and total order value above
              5000.
            </div>

            <pre className="sql-preview">{`SELECT
  c.customer_name,
  SUM(o.total_amount) AS total_value
FROM customers c
JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'delayed'
GROUP BY c.customer_name
HAVING SUM(o.total_amount) > 5000;`}</pre>

            <div className="preview-stats">
              <span>Risk: Low</span>
              <span>3 query options</span>
              <span>Optimized joins</span>
            </div>
          </div>
        </section>

        <section className="capability-grid" aria-label="Project capabilities">
          {capabilityCards.map((card) => (
            <article className="capability-card" key={card.title}>
              <h2>{card.title}</h2>
              <p>{card.text}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Landing;
