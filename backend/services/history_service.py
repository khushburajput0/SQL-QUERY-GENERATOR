from sqlalchemy import text
from database.db import engine


def save_query(prompt, generated_query, explanation):

    try:

        with engine.connect() as conn:

            conn.execute(
                text("""
                    INSERT INTO query_history
                    (prompt, generated_query, explanation)
                    VALUES
                    (:prompt, :generated_query, :explanation)
                """),
                {
                    "prompt": prompt,
                    "generated_query": generated_query,
                    "explanation": explanation
                }
            )

            conn.commit()

    except Exception as e:
        print("History Save Error:", e)

def get_history():

    try:

        with engine.connect() as conn:

            result = conn.execute(
                text("""
                    SELECT *
                    FROM query_history
                    ORDER BY created_at DESC
                """)
            )

            history = []

            for row in result:

                history.append({
                    "history_id": row.history_id,
                    "prompt": row.prompt,
                    "generated_query": row.generated_query,
                    "explanation": row.explanation,
                    "created_at": str(row.created_at)
                })

            return history

    except Exception as e:

        return {
            "error": str(e)
        }