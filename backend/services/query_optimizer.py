def optimize_query(sql_query):

    suggestions = []

    if "SELECT *" in sql_query.upper():
        suggestions.append(
            "Avoid SELECT *. Retrieve only required columns."
        )

    if "ORDER BY" in sql_query.upper():
        suggestions.append(
            "Consider indexing columns used in ORDER BY."
        )

    if len(suggestions) == 0:
        suggestions.append(
            "No optimization suggestions."
        )

    return suggestions