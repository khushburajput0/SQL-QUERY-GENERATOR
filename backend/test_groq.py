from services.groq_service import client

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {
            "role": "user",
            "content": "Convert to SQL: Show all employees whose salary is greater than 50000"
        }
    ]
)

print(response.choices[0].message.content)