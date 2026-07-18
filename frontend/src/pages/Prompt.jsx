import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import API from "../services/api";
import "../styles/Home.css";

const DATABASE_URL_STORAGE_KEY = "sqlQueryGeneratorDatabaseUrl";

function Prompt() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [queryResult, setQueryResult] = useState(null);

  const databaseUrl = localStorage.getItem(DATABASE_URL_STORAGE_KEY) || "";
  const databaseReady = Boolean(databaseUrl);
  const databasePayload = {
    database_url: databaseUrl
  };

  const generateQuery = async () => {
    try {
      setLoading(true);

      const response = await API.post("/generate", {
        prompt: prompt,
        ...databasePayload
      });

      setResult(response.data);
      setQueryResult(null);

    } catch (error) {
      console.error(error);
      alert("Error generating query");
    } finally {
      setLoading(false);
    }
  };

  const executeQuery = async (query) => {
    try {
      const response = await API.post("/execute", {
        query: query,
        ...databasePayload
      });

      setQueryResult(response.data);

    } catch (error) {
      console.error(error);
      alert("Error executing query");
    }
  };

  return (
    <div className="app-shell">
      <Navbar />

      <main className="workspace-page">
        <section className="workspace-header">
          <div>
            <p className="eyebrow">SQL workspace</p>
            <h1>Prompt</h1>
            <p>
              Describe the answer you need and generate SQL against the
              connected PostgreSQL database.
            </p>
          </div>

          <div className="workspace-summary">
            <span>Generate</span>
            <span>Review</span>
            <span>Execute</span>
          </div>
        </section>

        {!databaseReady && (
          <p className="connection-status warning">
            Connect a database from <Link to="/home">Home</Link> before generating SQL.
          </p>
        )}

        <section className="prompt-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Prompt</p>
              <h2>Ask for a query</h2>
            </div>
          </div>

          <textarea
            className="prompt-box"
            placeholder="Example: Show top 10 customers by total order value this month."
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
          />

          <div className="prompt-actions">
            <button
              className="generate-btn"
              onClick={generateQuery}
              disabled={loading || !prompt.trim() || !databaseReady}
            >
              {loading ? "Generating..." : "Generate Query"}
            </button>
          </div>
        </section>

        {result && (
          <section className="results-grid">
            <div className="query-options">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Generated SQL</p>
                  <h2>Query Options</h2>
                </div>
              </div>

              {result.query_options.map((query, index) => (
                <article key={index} className="query-card">
                  <div className="card-header">
                    <h3>Option {index + 1}</h3>
                    <span>SQL</span>
                  </div>

                  <pre>{query}</pre>

                  <button
                    className="execute-btn"
                    onClick={() => executeQuery(query)}
                    disabled={!databaseReady}
                  >
                    Execute Query
                  </button>
                </article>
              ))}
            </div>

            <aside className="analysis-column">
              <article className="info-card recommended-card">
                <p className="eyebrow">Best fit</p>
                <h2>Recommended Query</h2>

                <pre>{result.recommended_query}</pre>
              </article>

              <article className="info-card">
                <p className="eyebrow">Details</p>
                <h2>Explanation</h2>

                <p>{result.explanation}</p>
              </article>

              <article className="info-card impact-card">
                <p className="eyebrow">Impact</p>
                <h2>Analysis</h2>

                <div className="metric-row">
                  <span>Estimated Rows</span>
                  <strong>{result.impact_analysis.estimated_rows}</strong>
                </div>

                <div className="metric-row">
                  <span>Risk Level</span>
                  <strong>{result.impact_analysis.risk_level}</strong>
                </div>
              </article>

              <article className="info-card">
                <p className="eyebrow">Performance</p>
                <h2>Optimization Suggestions</h2>

                <ul>
                  {result.optimization_suggestions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </article>
            </aside>
          </section>
        )}

        {queryResult &&
          queryResult.success &&
          queryResult.rows &&
          queryResult.rows.length > 0 && (
            <div className="result-container">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Database response</p>
                  <h2>Execution Result</h2>
                </div>
              </div>

              <table className="result-table">
                <thead>
                  <tr>
                    {Object.keys(queryResult.rows[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {queryResult.rows.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((value, valueIndex) => (
                        <td key={valueIndex}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        )}

        {queryResult &&
          queryResult.success &&
          queryResult.rows &&
          queryResult.rows.length === 0 && (
            <div className="result-container">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Database response</p>
                  <h2>Execution Result</h2>
                </div>
              </div>

              <p className="empty-result">
                Query executed successfully, but no rows were returned.
              </p>
            </div>
        )}

        {queryResult && !queryResult.success && (
          <div className="result-container">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Database response</p>
                <h2>Execution Error</h2>
              </div>
            </div>

            <p className="error-result">{queryResult.error}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Prompt;
