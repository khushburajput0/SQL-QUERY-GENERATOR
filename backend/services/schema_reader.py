
from sqlalchemy import text
from database.db import get_engine

def get_database_schema(database_url=None):

    schema_text = ""
    engine = get_engine(database_url)

    with engine.connect() as conn:

        tables = conn.execute(text("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema='public'
        """))

        for table in tables:

            table_name = table[0]

            columns = conn.execute(text("""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema='public'
                AND table_name=:table_name
            """), {"table_name": table_name})

            column_names = [
                column[0]
                for column in columns
            ]

            schema_text += (
                f"\n{table_name}(\n"
                + ",\n".join(column_names)
                + "\n)\n"
            )

    return schema_text


def test_database_connection(database_url=None):
    engine = get_engine(database_url)

    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))

    return True
