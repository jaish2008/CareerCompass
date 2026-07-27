"""
One-time script: adds the settings_prefs column to the REAL
careercompass.db file, which lives inside the instance/ folder
(Flask-SQLAlchemy's default location for relative sqlite paths).

Run this ONCE from inside the backend/ folder.
"""

import os
import sqlite3

DB_FILE = os.path.join("instance", "careercompass.db")

print("Using database file:", os.path.abspath(DB_FILE))

connection = sqlite3.connect(DB_FILE)
cursor = connection.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [row[0] for row in cursor.fetchall()]
print("Tables found:", tables)

cursor.execute("PRAGMA table_info(career_profiles);")
existing_columns = [row[1] for row in cursor.fetchall()]

if "settings_prefs" in existing_columns:
    print("Nothing to do — settings_prefs column already exists.")
else:
    cursor.execute(
        "ALTER TABLE career_profiles ADD COLUMN settings_prefs TEXT;"
    )
    connection.commit()
    print("Success — settings_prefs column has been added.")

connection.close()