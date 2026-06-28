import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
function History() {

  const [history, setHistory] = useState([]);

  useEffect(() => {

    fetchHistory();

  }, []);

  const fetchHistory = async () => {

    try {

      const response = await API.get("/history");

      setHistory(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  return (
    <div style={{ padding: "30px" }}>

      <Navbar />

      <h1>Query History</h1>

      <table
        border="1"
        cellPadding="10"
        style={{
          borderCollapse: "collapse",
          width: "100%"
        }}
      >

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
  );
}

export default History;