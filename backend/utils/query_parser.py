import re

def extract_queries(text):

    queries = []

    pattern = r"Option\s*\d+\s*:\s*(.*?)(?=Option\s*\d+\s*:|$)"

    matches = re.findall(pattern, text, re.DOTALL)

    for match in matches:

        query = match.strip()

        query = query.replace("```sql", "")
        query = query.replace("```", "")
        query = query.strip()

        queries.append(query)

    return queries