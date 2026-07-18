from sqlalchemy import text
from database.db import get_engine


def analyze_query(sql_query, database_url=None):

    try:
        engine = get_engine(database_url)

        sql_query = sql_query.strip()

        # Remove ending semicolon if present
        if sql_query.endswith(";"):
            sql_query = sql_query[:-1]

        query_upper = sql_query.upper()

        # -------------------------
        # SELECT QUERY
        # -------------------------
        if query_upper.startswith("SELECT"):

            count_query = f"""
            SELECT COUNT(*) AS total
            FROM (
                {sql_query}
            ) AS temp
            """

            with engine.connect() as conn:
                result = conn.execute(text(count_query))
                row_count = result.scalar()

            return {
                "operation_type": "SELECT",
                "estimated_rows": row_count,
                "risk_level": "LOW",
                "message": f"Approximately {row_count} rows may be returned."
            }

        # -------------------------
        # UPDATE QUERY
        # -------------------------
        elif query_upper.startswith("UPDATE"):

            risk = "HIGH"

            if "WHERE" in query_upper:
                risk = "MEDIUM"

            return {
                "operation_type": "UPDATE",
                "estimated_rows": "Unknown",
                "risk_level": risk,
                "message": "This query will modify existing records."
            }

        # -------------------------
        # DELETE QUERY
        # -------------------------
        elif query_upper.startswith("DELETE"):

            risk = "CRITICAL"

            if "WHERE" in query_upper:
                risk = "HIGH"

            return {
                "operation_type": "DELETE",
                "estimated_rows": "Unknown",
                "risk_level": risk,
                "message": "This query may permanently delete records."
            }

        # -------------------------
        # INSERT QUERY
        # -------------------------
        elif query_upper.startswith("INSERT"):

            return {
                "operation_type": "INSERT",
                "estimated_rows": 1,
                "risk_level": "LOW",
                "message": "This query will insert new records."
            }

        # -------------------------
        # UNKNOWN QUERY
        # -------------------------
        return {
            "operation_type": "UNKNOWN",
            "estimated_rows": 0,
            "risk_level": "UNKNOWN",
            "message": "Unable to determine query impact."
        }

    except Exception as e:

        return {
            "operation_type": "ERROR",
            "estimated_rows": 0,
            "risk_level": "UNKNOWN",
            "message": str(e)
        }
