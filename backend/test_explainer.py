from services.query_explainer import explain_query

sql = """
SELECT *
FROM Students
ORDER BY cgpa DESC
LIMIT 5;
"""

result = explain_query(sql)

print(result)