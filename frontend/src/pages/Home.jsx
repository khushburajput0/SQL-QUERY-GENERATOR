import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import API from "../services/api";
import "../styles/Home.css";

const DATABASE_URL_STORAGE_KEY = "sqlQueryGeneratorDatabaseUrl";

function Home() {
  const navigate = useNavigate();
  const [connectionMethod, setConnectionMethod] = useState("url");
  const [databaseUrl, setDatabaseUrl] = useState("");
  const [databaseDetails, setDatabaseDetails] = useState({
    host: "",
    port: "5432",
    database: "",
    user: "",
    password: ""
  });
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [schemaPreview, setSchemaPreview] = useState("");

  const buildDetailsDatabaseUrl = () => {
    const { host, port, database, user, password } = databaseDetails;

    if (!host.trim() || !database.trim() || !user.trim()) {
      return "";
    }

    const credentials = password
      ? `${encodeURIComponent(user)}:${encodeURIComponent(password)}`
      : encodeURIComponent(user);

    return `postgresql://${credentials}@${host.trim()}:${port.trim() || "5432"}/${database.trim()}`;
  };

  const selectedDatabaseUrl = connectionMethod === "url"
    ? databaseUrl.trim()
    : buildDetailsDatabaseUrl();

  const databaseReady = Boolean(selectedDatabaseUrl);

  const databasePayload = selectedDatabaseUrl
    ? { database_url: selectedDatabaseUrl }
    : { database_url: "" };

  const clearConnectionFeedback = () => {
    setConnectionStatus(null);
    setSchemaPreview("");
  };

  const updateDatabaseDetail = (field, value) => {
    setDatabaseDetails((currentDetails) => ({
      ...currentDetails,
      [field]: value
    }));
    clearConnectionFeedback();
  };

  const testConnection = async () => {
    try {
      setConnectionStatus({
        type: "loading",
        message: "Checking database connection..."
      });

      const response = await API.post("/database/test", databasePayload);

      if (response.data.success) {
        localStorage.setItem(DATABASE_URL_STORAGE_KEY, selectedDatabaseUrl);
        setConnectionStatus({
          type: "success",
          message: "Database connected successfully. You can now move to the Prompt page to generate a query."
        });
        return;
      }

      setConnectionStatus({
        type: "error",
        message: response.data.message
      });

    } catch (error) {
      console.error(error);
      setConnectionStatus({
        type: "error",
        message: "Unable to test database connection."
      });
    }
  };

  const loadSchema = async () => {
    try {
      setSchemaPreview("Loading schema...");

      const response = await API.post("/database/schema", databasePayload);

      if (response.data.success) {
        setSchemaPreview(response.data.schema || "No public tables found.");
      } else {
        setSchemaPreview(response.data.message || "Unable to load schema.");
      }

    } catch (error) {
      console.error(error);
      setSchemaPreview("Unable to load schema.");
    }
  };

  return (
    <div className="app-shell">
      <Navbar />

      <main className="workspace-page">
        <section className="workspace-header">
          <div>
            <p className="eyebrow">SQL workspace</p>
            <h1>Home</h1>
            <p>
              Connect your PostgreSQL database before generating SQL against
              your real schema.
            </p>
          </div>

          <div className="workspace-summary">
            <span>Connect</span>
            <span>Verify</span>
            <span>Continue</span>
          </div>
        </section>

        <section className="database-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Database</p>
              <h2>Connect your PostgreSQL database</h2>
            </div>
          </div>

          <div className="database-options">
            <label className="database-option">
              <input
                type="radio"
                name="connection-method"
                value="url"
                checked={connectionMethod === "url"}
                onChange={() => {
                  setConnectionMethod("url");
                  clearConnectionFeedback();
                }}
              />
              <span>
                <strong>Connection URL</strong>
                <small>Paste your complete PostgreSQL connection string.</small>
              </span>
            </label>

            <label className="database-option">
              <input
                type="radio"
                name="connection-method"
                value="details"
                checked={connectionMethod === "details"}
                onChange={() => {
                  setConnectionMethod("details");
                  clearConnectionFeedback();
                }}
              />
              <span>
                <strong>Connection details</strong>
                <small>Enter host, port, database name, username, and password.</small>
              </span>
            </label>
          </div>

          {connectionMethod === "url" && (
            <input
              className="database-input"
              type="password"
              placeholder="postgresql://username:password@host:5432/database"
              value={databaseUrl}
              onChange={(event) => {
                setDatabaseUrl(event.target.value);
                clearConnectionFeedback();
              }}
            />
          )}

          {connectionMethod === "details" && (
            <div className="database-form-grid">
              <input
                className="database-input"
                type="text"
                placeholder="Host"
                value={databaseDetails.host}
                onChange={(event) => updateDatabaseDetail("host", event.target.value)}
              />

              <input
                className="database-input"
                type="text"
                placeholder="Port"
                value={databaseDetails.port}
                onChange={(event) => updateDatabaseDetail("port", event.target.value)}
              />

              <input
                className="database-input"
                type="text"
                placeholder="Database name"
                value={databaseDetails.database}
                onChange={(event) => updateDatabaseDetail("database", event.target.value)}
              />

              <input
                className="database-input"
                type="text"
                placeholder="Username"
                value={databaseDetails.user}
                onChange={(event) => updateDatabaseDetail("user", event.target.value)}
              />

              <input
                className="database-input database-password"
                type="password"
                placeholder="Password"
                value={databaseDetails.password}
                onChange={(event) => updateDatabaseDetail("password", event.target.value)}
              />
            </div>
          )}

          <div className="database-actions">
            <button
              className="secondary-button"
              onClick={testConnection}
              disabled={!databaseReady}
            >
              Connect Database
            </button>

            <button
              className="secondary-button"
              onClick={loadSchema}
              disabled={!databaseReady}
            >
              Preview Schema
            </button>
          </div>

          {connectionStatus && (
            <p className={`connection-status ${connectionStatus.type}`}>
              {connectionStatus.message}
            </p>
          )}

          {connectionStatus?.type === "success" && (
            <div className="database-actions">
              <button
                className="generate-btn"
                onClick={() => navigate("/prompt")}
              >
                Generate Query
              </button>
            </div>
          )}

          {!databaseReady && (
            <p className="connection-status warning">
              Enter your database connection before continuing.
            </p>
          )}

          {schemaPreview && (
            <pre className="schema-preview">{schemaPreview}</pre>
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;
