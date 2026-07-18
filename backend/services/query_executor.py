from decimal import Decimal
from sqlalchemy import text
from database.db import get_engine

def execute_query(sql_query, database_url=None):

    try:
        engine = get_engine(database_url)

        with engine.connect() as conn:

            result = conn.execute(text(sql_query))

            rows = []

            if result.returns_rows:

                columns = result.keys()

                for row in result:

                    row_dict = {}

                    for col, val in zip(columns, row):

                        if isinstance(val, Decimal):
                            row_dict[col] = float(val)
                        else:
                            row_dict[col] = val

                    rows.append(row_dict)

            return {
                "success": True,
                "rows": rows
            }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }
