from database import get_db_connection

conn = get_db_connection()
cursor = conn.cursor()

# Drop old tables (development only)
cursor.execute("DROP TABLE IF EXISTS roadmap")
cursor.execute("DROP TABLE IF EXISTS student_assessment")

# Roadmap table
cursor.execute("""
CREATE TABLE roadmap (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    career_name TEXT NOT NULL,
    step_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT
)
""")

# Student Assessment table
cursor.execute("""
CREATE TABLE student_assessment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    name TEXT NOT NULL,
    department TEXT,
    semester INTEGER,
    cgpa REAL,

    programming TEXT,
    dsa TEXT,
    web TEXT,
    database_skill TEXT,
    communication TEXT,

    career TEXT,

    study_hours INTEGER,
    projects INTEGER,
    github TEXT
)
""")

conn.commit()
conn.close()

print("✅ Tables created successfully!")