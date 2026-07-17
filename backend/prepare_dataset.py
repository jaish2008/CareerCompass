import pandas as pd
import os


# ==========================================
# File Paths
# ==========================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

INPUT_FILE = os.path.join(
    BASE_DIR,
    "datasets",
    "survey_results_public.csv"
)

OUTPUT_FILE = os.path.join(
    BASE_DIR,
    "datasets",
    "career_dataset.csv"
)


# ==========================================
# Load Dataset
# ==========================================

print("Loading Stack Overflow dataset...")

df = pd.read_csv(
    INPUT_FILE,
    low_memory=False
)

print("Original dataset shape:", df.shape)


# ==========================================
# Select Required Columns
# ==========================================

required_columns = [
    "DevType",
    "LanguageHaveWorkedWith",
    "DatabaseHaveWorkedWith",
    "PlatformHaveWorkedWith",
    "WebframeHaveWorkedWith",
    "YearsCode",
    "WorkExp"
]

df = df[required_columns].copy()

print("Selected columns:")
print(df.columns.tolist())


# ==========================================
# Remove Rows Without Career Role
# ==========================================

df = df.dropna(subset=["DevType"])

print("Rows after removing missing DevType:", len(df))


# ==========================================
# Career Mapping
# ==========================================

def map_career(dev_type):

    role = str(dev_type).strip().lower()

    career_mapping = {
        "developer, front-end":
            "Frontend Developer",

        "developer, back-end":
            "Backend Developer",

        "developer, full-stack":
            "Full Stack Developer",

        "data scientist":
            "AI/ML Engineer",

        "data or business analyst":
            "Data Analyst",

        "devops engineer or professional":
            "DevOps Engineer",

        "cloud infrastructure engineer":
            "DevOps Engineer"
    }

    return career_mapping.get(role)

df["career"] = df["DevType"].apply(map_career)

df = df.dropna(subset=["career"])

print("\nCareer distribution:")
print(df["career"].value_counts())

# ==========================================
# Technology Detection Helper
# ==========================================

def has_skill(value, skill):

    if pd.isna(value):
        return 0

    skills = [
        item.strip().lower()
        for item in str(value).split(";")
    ]

    return int(skill.lower() in skills)


# ==========================================
# Programming Language Features
# ==========================================

language_features = {
    "html_css": "HTML/CSS",
    "javascript": "JavaScript",
    "typescript": "TypeScript",
    "python": "Python",
    "java": "Java",
    "sql": "SQL",
    "csharp": "C#",
    "cpp": "C++",
    "php": "PHP",
    "go": "Go",
    "rust": "Rust",
    "r_language": "R"
}

for feature, skill in language_features.items():

    df[feature] = df["LanguageHaveWorkedWith"].apply(
        lambda value, current_skill=skill:
        has_skill(value, current_skill)
    )


# ==========================================
# Web Framework Features
# ==========================================

framework_features = {
    "react": "React",
    "angular": "Angular",
    "vue": "Vue.js",
    "nodejs": "Node.js",
    "express": "Express",
    "django": "Django",
    "flask": "Flask",
    "spring_boot": "Spring Boot",
    "aspnet": "ASP.NET CORE"
}

for feature, skill in framework_features.items():

    df[feature] = df["WebframeHaveWorkedWith"].apply(
        lambda value, current_skill=skill:
        has_skill(value, current_skill)
    )


# ==========================================
# Database Features
# ==========================================

database_features = {
    "mysql": "MySQL",
    "postgresql": "PostgreSQL",
    "mongodb": "MongoDB",
    "sqlite": "SQLite",
    "redis": "Redis",
    "microsoft_sql_server": "Microsoft SQL Server"
}

for feature, skill in database_features.items():

    df[feature] = df["DatabaseHaveWorkedWith"].apply(
        lambda value, current_skill=skill:
        has_skill(value, current_skill)
    )


# ==========================================
# Platform and DevOps Features
# ==========================================

platform_features = {
    "docker": "Docker",
    "aws": "Amazon Web Services (AWS)",
    "azure": "Microsoft Azure",
    "gcp": "Google Cloud",
    "kubernetes": "Kubernetes",
    "terraform": "Terraform"
}

for feature, skill in platform_features.items():

    df[feature] = df["PlatformHaveWorkedWith"].apply(
        lambda value, current_skill=skill:
        has_skill(value, current_skill)
    )


# ==========================================
# General Technology Diversity
# ==========================================

def count_technologies(value):

    if pd.isna(value):
        return 0

    return len([
        item
        for item in str(value).split(";")
        if item.strip()
    ])


df["language_count"] = (
    df["LanguageHaveWorkedWith"]
    .apply(count_technologies)
)

df["framework_count"] = (
    df["WebframeHaveWorkedWith"]
    .apply(count_technologies)
)

df["database_count"] = (
    df["DatabaseHaveWorkedWith"]
    .apply(count_technologies)
)

df["platform_count"] = (
    df["PlatformHaveWorkedWith"]
    .apply(count_technologies)
)

# ==========================================
# Final ML Dataset
# ==========================================

final_columns = [
    "html_css",
    "javascript",
    "typescript",
    "python",
    "java",
    "sql",
    "csharp",
    "cpp",
    "php",
    "go",
    "rust",
    "r_language",

    "react",
    "angular",
    "vue",
    "nodejs",
    "express",
    "django",
    "flask",
    "spring_boot",
    "aspnet",

    "mysql",
    "postgresql",
    "mongodb",
    "sqlite",
    "redis",
    "microsoft_sql_server",

    "docker",
    "aws",
    "azure",
    "gcp",
    "kubernetes",
    "terraform",

    "language_count",
    "framework_count",
    "database_count",
    "platform_count",

    "career"
]


career_df = df[final_columns].copy()


# ==========================================
# Save Dataset
# ==========================================

career_df.to_csv(
    OUTPUT_FILE,
    index=False
)

print("\nCareerCompass dataset created successfully.")

print("Final dataset shape:", career_df.shape)

print("\nDataset preview:")

print(career_df.head())

print("\nSaved at:")

print(OUTPUT_FILE)