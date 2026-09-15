"""Memory-efficient search over the local Wikipedia dataset."""

from __future__ import annotations

from pathlib import Path

import duckdb

MAX_CONTEXT_CHARACTERS = 8_000


def search_wikipedia_dataset(topic: str, file_path: str = "wikipedia_data.csv") -> str:
    """Find up to three matching articles and return bounded text context."""
    topic = topic.strip()
    if not topic or not Path(file_path).is_file():
        return ""

    escaped_topic = topic.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
    pattern = f"%{escaped_topic}%"
    source = "read_parquet(?)" if Path(file_path).suffix.lower() == ".parquet" else "read_csv_auto(?)"
    query = f"""
        SELECT text
        FROM {source}
        WHERE lower(CAST(title AS VARCHAR)) LIKE lower(?) ESCAPE '\\'
           OR lower(CAST(text AS VARCHAR)) LIKE lower(?) ESCAPE '\\'
        LIMIT 3
    """
    try:
        with duckdb.connect() as connection:
            rows = connection.execute(query, [file_path, pattern, pattern]).fetchall()
    except (duckdb.Error, OSError):
        return ""

    context = "\n\n".join(str(row[0]) for row in rows if row[0] is not None)
    return context[:MAX_CONTEXT_CHARACTERS]