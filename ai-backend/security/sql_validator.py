import re

FORBIDDEN_KEYWORDS = [
 "DROP", "DELETE", "TRUNCATE", "ALTER", "CREATE", "INSERT", "UPDATE",
 "EXEC", "EXECUTE", "UNION", "--", ";", "/*", "*/",
]

def validate_sql(query: str) -> tuple[bool, str]:
 pass
