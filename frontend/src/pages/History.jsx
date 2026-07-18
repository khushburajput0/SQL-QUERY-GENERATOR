import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import "../styles/Home.css";

function History() {

  const [history, setHistory] = useState([]);

  useEffect(() => {
    let ignore = false;

    API.get("/history")
      .then((response) => {
        if (!ignore) {
          setHistory(response.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="app-shell">
      <Navbar />

      <main className="workspace-page">
        <section className="workspace-header">
          <div>
            <p className="eyebrow">Saved activity</p>
            <h1>Query History</h1>
            <p>
              Review previous prompts, generated SQL, and when each request was
              created.
            </p>
          </div>
        </section>

        <div className="result-container">
          <table className="history-table">

            <thead>

              <tr>
                <th>ID</th>
                <th>Prompt</th>
                <th>Generated Query</th>
                <th>Date</th>
              </tr>

            </thead>

            <tbody>

              {
                history.map((item) => (

                  <tr key={item.history_id}>

                    <td>{item.history_id}</td>

                    <td>{item.prompt}</td>

                    <td>{item.generated_query}</td>

                    <td>{item.created_at}</td>

                  </tr>

                ))
              }

            </tbody>

          </table>
        </div>
      </main>

    </div>
  );
}

export default History;
