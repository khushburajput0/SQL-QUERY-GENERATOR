from services.query_executor import execute_query

sql = """
SELECT *
FROM Students
"""

result = execute_query(sql)

print(result)