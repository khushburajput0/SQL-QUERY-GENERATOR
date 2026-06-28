from services.sql_generator import generate_sql

query = generate_sql(
    "Find top 5 students with highest CGPA"
)

print(query)