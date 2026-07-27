"""
One-time script: adds the settings_prefs column to the existing
careercompass.db SQLite file, without deleting any existing data.

Run this ONCE from inside the backend/ folder (same folder that
already contains careercompass.db).
"""

import sqlite3

DB_FILE = "careercompass.db"

connection = sqlite3.connect(DB_FILE)
cursor = connection.cursor()

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