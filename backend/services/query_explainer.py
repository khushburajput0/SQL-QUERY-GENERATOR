from services.groq_service import client
from services.schema_reader import get_database_schema

def explain_query(sql_query, database_url=None):

    schema = get_database_schema(database_url)

    prompt = f"""
    Database Schema:
    {schema}

    SQL Query:
    {sql_query}

    Explain this SQL query in 1-2 simple sentences.

    Keep explanation short.
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

    return response.choices[0].message.content.strip()
