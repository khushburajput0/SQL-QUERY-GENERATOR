from services.query_optimizer import optimize_query

sql = """
SELECT *
FROM Students
ORDER BY cgpa DESC
"""

print(optimize_query(sql))