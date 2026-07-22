import sqlite3

conn = sqlite3.connect("careercompass.db")
cur = conn.cursor()

roadmap_data = {
    "Web Development": [
        (1, "HTML, CSS & Responsive Design", "Build strong fundamentals in semantic HTML and modern CSS (Flexbox, Grid) before touching frameworks."),
        (2, "JavaScript Fundamentals", "Master core JS: DOM manipulation, async/await, fetch API, ES6+ syntax."),
        (3, "Frontend Framework (React)", "Learn component-based architecture, hooks, and state management with React."),
        (4, "Backend Basics (Flask / Node.js)", "Build REST APIs, handle authentication, and connect to a database."),
        (5, "Databases & Deployment", "Learn SQL basics and deploy a full-stack project."),
        (6, "Portfolio Projects", "Ship 2-3 complete full-stack projects and publish them on GitHub with live demos."),
    ],
    "Software Development / DSA": [
        (1, "Programming Language Mastery", "Get fluent in one language (Python/Java/C++) — syntax, OOP, standard library."),
        (2, "Core Data Structures", "Arrays, linked lists, stacks, queues, hashmaps, trees, graphs."),
        (3, "Algorithms & Complexity", "Sorting, searching, recursion, dynamic programming, time/space complexity."),
        (4, "Problem Solving Practice", "Solve 150+ problems on LeetCode/GFG, focusing on patterns not memorization."),
        (5, "System Design Basics", "Learn basic system design concepts for interviews: scalability, databases, caching."),
        (6, "Mock Interviews", "Practice timed coding interviews and behavioral rounds."),
    ],
    "AI / ML Foundation": [
        (1, "Python & Math Foundations", "Strengthen Python, linear algebra, probability, and statistics fundamentals."),
        (2, "Data Handling", "Learn pandas, numpy, and data cleaning/visualization with matplotlib/seaborn."),
        (3, "Core Machine Learning", "Understand regression, classification, clustering using scikit-learn."),
        (4, "Model Evaluation & Tuning", "Learn cross-validation, hyperparameter tuning, and evaluation metrics."),
        (5, "Deep Learning Basics", "Get introduced to neural networks using TensorFlow or PyTorch."),
        (6, "ML Projects & Portfolio", "Build 2-3 end-to-end ML projects and document them clearly on GitHub."),
    ],
}

for career_name, steps in roadmap_data.items():
    for step_number, title, description in steps:
        cur.execute("""
            INSERT INTO roadmap (career_name, step_number, title, description)
            VALUES (?, ?, ?, ?)
        """, (career_name, step_number, title, description))

conn.commit()
conn.close()
print("Roadmap seeded successfully.")