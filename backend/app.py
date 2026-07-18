from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from services.query_alternatives import generate_alternative_queries
from utils.query_parser import extract_queries
from services.query_explainer import explain_query
from services.impact_analyzer import analyze_query
from services.query_validator import validate_query
from services.query_optimizer import optimize_query
from services.query_executor import execute_query
from services.schema_reader import (
    get_database_schema,
    test_database_connection
)
from services.history_service import (
    save_query,
    get_history
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str
    database_url: str

class ExecuteRequest(BaseModel):
    query: str
    database_url: str

class DatabaseRequest(BaseModel):
    database_url: str

def get_required_database_url(database_url: str):

    cleaned_url = database_url.strip()

    if not cleaned_url:
        raise HTTPException(
            status_code=400,
            detail="Please enter your PostgreSQL database connection."
        )

    return cleaned_url

@app.get("/")
def home():
    return {
        "message": "SQL Query Generator API Running"
    }

@app.post("/generate")
def generate_query(data: PromptRequest):

    database_url = get_required_database_url(data.database_url)

    raw_options = generate_alternative_queries(
        data.prompt,
        database_url
    )

    query_options = extract_queries(raw_options)

    recommended_query = query_options[0]

    explanation = explain_query(
        recommended_query,
        database_url
    )

    impact = analyze_query(
        recommended_query,
        database_url
    )

    validation = validate_query(recommended_query)

    optimization = optimize_query(recommended_query)

    save_query(
        data.prompt,
        recommended_query,
        explanation
    )

    return {
        "user_prompt": data.prompt,
        "query_options": query_options,
        "recommended_query": recommended_query,
        "explanation": explanation,
        "impact_analysis": impact,
        "validation": validation,
        "optimization_suggestions": optimization
    }

@app.post("/execute")
def execute_selected_query(data: ExecuteRequest):

    database_url = get_required_database_url(data.database_url)

    result = execute_query(
        data.query,
        database_url
    )

    return result

@app.post("/database/test")
def test_database(data: DatabaseRequest):

    try:
        database_url = get_required_database_url(data.database_url)

        test_database_connection(database_url)

        return {
            "success": True,
            "message": "Database connection successful."
        }

    except Exception as error:
        return {
            "success": False,
            "message": str(error)
        }

@app.post("/database/schema")
def database_schema(data: DatabaseRequest):

    try:
        database_url = get_required_database_url(data.database_url)

        schema = get_database_schema(database_url)

        return {
            "success": True,
            "schema": schema
        }

    except Exception as error:
        return {
            "success": False,
            "schema": "",
            "message": str(error)
        }

@app.get("/history")
def history():

    return get_history()

