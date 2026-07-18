# Backend

This backend powers the SQL Query Generator API built with FastAPI.

## Overview

The backend exposes endpoints for:
- generating SQL query alternatives from a natural-language prompt
- explaining generated queries
- analyzing query impact
- validating and optimizing SQL
- executing queries against a PostgreSQL database
- saving and retrieving query history

## Project Structure

- app.py: FastAPI app entry point and API routes
- services/: business logic for query generation, explanation, validation, optimization, execution, and history
- utils/: helper modules such as query parsing
- database/: database connection helpers

## Setup

Run these commands from the project root.

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Confirm Python is coming from this backend's virtual environment:

```powershell
.\.venv\Scripts\python.exe -c "import sys; print(sys.executable)"
```

Expected path:

```text
...\SQL_QUERY_GENERATOR\backend\.venv\Scripts\python.exe
```

## Environment Variables

If required by your setup, create a `.env` file in the backend folder with values such as:

```env
GROQ_API_KEY=your_groq_api_key
```

## Run the Server

From the backend folder:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app:app --reload --port 8000
```

From the project root:

```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn app:app --reload --port 8000
```

The API will be available at:
- http://127.0.0.1:8000
- http://localhost:8000

## API Endpoints

- GET `/` - health check
- POST `/generate` - generate SQL query options from a prompt
- POST `/execute` - execute a selected SQL query
- POST `/database/test` - test a PostgreSQL connection
- POST `/database/schema` - fetch database schema information
- GET `/history` - view stored query history

## Notes

- The backend expects a valid PostgreSQL connection string for database-related features.
- Some features depend on external services such as Groq and the configured database.
- If `.\.venv\Scripts\Activate.ps1` is missing, use the commands above. They run the backend through `.\.venv\Scripts\python.exe` directly, so activation is not required.
- If you see `ModuleNotFoundError: No module named 'groq'`, you are either using the wrong virtual environment or dependencies were not installed in this backend's `.venv`. Run the setup commands above again from the project root.
