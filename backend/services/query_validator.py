import sqlparse

def validate_query(sql_query):

    try:
        parsed = sqlparse.parse(sql_query)

        if not parsed:
            return {
                "valid": False,
                "message": "Invalid SQL"
            }

        return {
            "valid": True,
            "message": "SQL syntax appears valid"
        }

    except Exception as e:
        return {
            "valid": False,
            "message": str(e)
        }