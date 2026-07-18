from services.schema_reader import get_database_schema
from services.groq_service import client

def generate_sql(user_prompt, database_url=None):

    from services.schema_reader import get_database_schema

    schema = get_database_schema(database_url)

    prompt = f"""
    You are an expert SQL generator.

    Database Schema:
    {schema}

    User Request:
    {user_prompt}

    Rules:
    1. Generate only SQL query.
    2. Do not explain.
    3. Use PostgreSQL syntax.
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    sql = response.choices[0].message.content

    # Remove markdown formatting if present
    sql = sql.replace("```sql", "")
    sql = sql.replace("```", "")
    sql = sql.strip()

    return sql
