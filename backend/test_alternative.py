from services.query_alternatives import generate_alternative_queries

result = generate_alternative_queries(
    "Find top 5 students with highest CGPA"
)

print(result)