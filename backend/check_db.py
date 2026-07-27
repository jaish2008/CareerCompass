"""
Diagnostic script — lists every table in careercompass.db so we can
see what's actually in this database file before touching it.
"""

import os
import sqlite3

DB_FILE = "careercompass.db"

print("Looking for:", os.path.abspath(DB_FILE))
print("File exists:", os.path.exists(DB_FILE))

if os.path.exists(DB_FILE):
    print("File size (bytes):", os.path.getsize(DB_FILE))

    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]

    print("Tables found:", tables)

    connection.close()