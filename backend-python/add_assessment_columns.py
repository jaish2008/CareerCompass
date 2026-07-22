import sqlite3

conn = sqlite3.connect("careercompass.db")
cur = conn.cursor()

new_columns = [
    ("prediction", "INTEGER"),
    ("placement_readiness", "REAL"),
    ("confidence_score", "REAL"),
    ("recommended_domain", "TEXT"),
    ("suggestions", "TEXT"),
    ("assessment_date", "TEXT"),
]

cur.execute("PRAGMA table_info(student_assessment)")
existing = {row[1] for row in cur.fetchall()}

for col_name, col_type in new_columns:
    if col_name not in existing:
        cur.execute(f"ALTER TABLE student_assessment ADD COLUMN {col_name} {col_type}")
        print(f"Added column: {col_name}")
    else:
        print(f"Already exists, skipped: {col_name}")

conn.commit()
conn.close()
print("Migration complete.")