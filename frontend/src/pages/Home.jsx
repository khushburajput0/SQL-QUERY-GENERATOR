
import Navbar from "../components/Navbar";
import { useState } from "react";
import API from "../services/api";
import "../styles/Home.css";

function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [queryResult, setQueryResult] = useState(null);

  const generateQuery = async () => {
    try {
      setLoading(true);

      const response = await API.post("/generate", {
        prompt: prompt,
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
      });

      setQueryResult(response.data);

    } catch (error) {
      console.error(error);
      alert("Error executing query");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">

        <h1 className="title">
          SQL Query Generator
        </h1>

        <div className="prompt-section">

          <textarea
            className="prompt-box"
            placeholder="Enter your query..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            className="generate-btn"
            onClick={generateQuery}
          >
            {loading ? "Generating..." : "Generate Query"}
          </button>

        </div>

        {result && (
          <>
            <h2 style={{ marginTop: "30px" }}>
              Query Options
            </h2>

            {result.query_options.map((query, index) => (
              <div
                key={index}
                className="query-card"
              >
                <h4>
                  Option {index + 1}
                </h4>

                <pre>{query}</pre>

                <button
                  className="execute-btn"
                  onClick={() => executeQuery(query)}
                >
                  Execute Query
                </button>

              </div>
            ))}

            <div className="info-card">

              <h2>Recommended Query</h2>

              <pre>
                {result.recommended_query}
              </pre>

            </div>

            <div className="info-card">

              <h2>Explanation</h2>

              <p>
                {result.explanation}
              </p>

            </div>

            <div className="info-card">

              <h2>Impact Analysis</h2>

              <p>
                Estimated Rows:
                {" "}
                {result.impact_analysis.estimated_rows}
              </p>

              <p>
                Risk Level:
                {" "}
                {result.impact_analysis.risk_level}
              </p>

            </div>

            <div className="info-card">

              <h2>
                Optimization Suggestions
              </h2>

              <ul>

                {result.optimization_suggestions.map(
                  (item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}

              </ul>

            </div>

          </>
        )}

        {queryResult &&
          queryResult.success &&
          queryResult.rows &&
          queryResult.rows.length > 0 && (

            <div className="result-container">

              <h2
                style={{
                  marginBottom: "15px",
                  marginTop: "20px"
                }}
              >
                Execution Result
              </h2>

              <table className="result-table">

                <thead>

                  <tr>

                    {Object.keys(
                      queryResult.rows[0]
                    ).map((key) => (
                      <th key={key}>
                        {key}
                      </th>
                    ))}

                  </tr>

                </thead>

                <tbody>

                  {queryResult.rows.map(
                    (row, index) => (
                      <tr key={index}>

                        {Object.values(row).map(
                          (value, i) => (
                            <td key={i}>
                              {value}
                            </td>
                          )
                        )}

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
        )}

      </div>
    </>
  );
}

export default Home;
