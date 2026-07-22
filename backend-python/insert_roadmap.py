from database import get_db_connection

conn = get_db_connection()
cursor = conn.cursor()

roadmaps = [

    ("Frontend Developer", 1, "Learn HTML", "Learn HTML structure and semantic tags."),
    ("Frontend Developer", 2, "Learn CSS", "Master Flexbox, Grid and Responsive Design."),
    ("Frontend Developer", 3, "Learn JavaScript", "Understand DOM, ES6 and Fetch API."),
    ("Frontend Developer", 4, "Learn React", "Build modern frontend applications."),

    ("Backend Developer", 1, "Learn Python", "Master Python fundamentals."),
    ("Backend Developer", 2, "Learn Flask", "Build REST APIs using Flask."),
    ("Backend Developer", 3, "Learn SQL", "Design and query databases."),
    ("Backend Developer", 4, "Authentication", "Implement login and JWT authentication."),

    ("Full Stack Developer", 1, "Frontend", "HTML, CSS and JavaScript."),
    ("Full Stack Developer", 2, "Backend", "Python Flask APIs."),
    ("Full Stack Developer", 3, "Database", "SQLite/MySQL integration."),
    ("Full Stack Developer", 4, "Deployment", "Deploy using Render or Railway."),

    ("Software Developer", 1, "Programming", "Master C++, Java or Python."),
    ("Software Developer", 2, "Data Structures", "Arrays, Linked Lists, Trees and Graphs."),
    ("Software Developer", 3, "System Design", "Basics of scalable applications."),
    ("Software Developer", 4, "Projects", "Build strong portfolio projects."),

    ("Data Analyst", 1, "Excel", "Learn Excel and spreadsheets."),
    ("Data Analyst", 2, "SQL", "Query databases efficiently."),
    ("Data Analyst", 3, "Power BI", "Create dashboards."),
    ("Data Analyst", 4, "Python", "Use Pandas and Matplotlib."),

    ("AI / ML Engineer", 1, "Python", "Programming fundamentals."),
    ("AI / ML Engineer", 2, "NumPy & Pandas", "Data manipulation."),
    ("AI / ML Engineer", 3, "Machine Learning", "Scikit-learn algorithms."),
    ("AI / ML Engineer", 4, "Deep Learning", "TensorFlow and PyTorch basics."),

    ("Cyber Security", 1, "Networking", "TCP/IP, DNS and HTTP."),
    ("Cyber Security", 2, "Linux", "Linux commands and scripting."),
    ("Cyber Security", 3, "Ethical Hacking", "OWASP and penetration testing."),
    ("Cyber Security", 4, "Security Tools", "Wireshark and Burp Suite."),

    ("Cloud Engineer", 1, "Linux", "Linux administration."),
    ("Cloud Engineer", 2, "AWS", "Core AWS services."),
    ("Cloud Engineer", 3, "Docker", "Containerization."),
    ("Cloud Engineer", 4, "Kubernetes", "Container orchestration.")

]

cursor.executemany("""
INSERT INTO roadmap (career_name, step_number, title, description)
VALUES (?, ?, ?, ?)
""", roadmaps)

conn.commit()
conn.close()

print("✅ Roadmaps inserted successfully!")