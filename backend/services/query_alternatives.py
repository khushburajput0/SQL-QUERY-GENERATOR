from services.schema_reader import get_database_schema
from services.groq_service import client

def generate_alternative_queries(user_prompt):

    
    schema = get_database_schema()

    prompt = f"""
        Database Schema:
        {schema}

        User Request:
        {user_prompt}

        Generate 3 different PostgreSQL query options.

        Rules:
        1. Use PostgreSQL syntax only.
        2. Never use TOP.
        3. Use LIMIT for row restriction.
        4. Return only SQL.
        5. Number as:
        Option 1:
        Option 2:
        Option 3:
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

    return response.choices[0].message.content