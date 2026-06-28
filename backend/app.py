from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from services.query_alternatives import generate_alternative_queries
from utils.query_parser import extract_queries
from services.sql_generator import generate_sql
from services.query_explainer import explain_query
from services.impact_analyzer import analyze_query
from services.query_validator import validate_query
from services.query_optimizer import optimize_query
from services.query_executor import execute_query
from services.history_service import (
    save_query,
    get_history
)
from services.query_alternatives import generate_alternative_queries

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PromptRequest(BaseModel):
    prompt: str

class ExecuteRequest(BaseModel):
    query: str

@app.get("/")
def home():
    return {
        "message": "SQL Query Generator API Running"
    }

@app.post("/generate")
def generate_query(data: PromptRequest):

    raw_options = generate_alternative_queries(data.prompt)

    query_options = extract_queries(raw_options)

    recommended_query = query_options[0]

    explanation = explain_query(recommended_query)

    impact = analyze_query(recommended_query)

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

    result = execute_query(data.query)

    return result

@app.get("/history")
def history():

    return get_history()

