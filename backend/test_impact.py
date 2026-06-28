from services.impact_analyzer import analyze_query

sql = """
SELECT *
FROM Students
ORDER BY cgpa DESC
LIMIT 5
"""

result = analyze_query(sql)

print(result)