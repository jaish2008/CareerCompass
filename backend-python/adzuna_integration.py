import os
import time
import requests
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
from apscheduler.schedulers.background import BackgroundScheduler

load_dotenv()

# Self-contained init: works whether this file is imported by main.py
# or run directly. The _apps check prevents a "duplicate app" crash
# if main.py already initialized it.
if not firebase_admin._apps:
    cred = credentials.Certificate("./serviceAccountKey.json")
    firebase_admin.initialize_app(cred)

db = firestore.client()

ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")
ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs/in/search/1"

# ---------------------------------------------------------
# 1. Role categories to search for — matches your 8 tabs
# ---------------------------------------------------------
ROLE_SEARCH_TERMS = {
    "software": "software developer intern",
    "frontend": "frontend developer intern",
    "backend": "backend developer intern",
    "fullstack": "full stack developer intern",
    "datascience": "data scientist intern",
    "aiml": "machine learning intern",
    "cybersecurity": "cyber security intern",
    "cloud": "cloud engineer intern"
}

# ---------------------------------------------------------
# 2. Skill dictionary used for keyword-based extraction
# ---------------------------------------------------------
SKILL_DICTIONARY = [
    "HTML", "CSS", "JavaScript", "TypeScript", "React", "Angular", "Vue",
    "Node.js", "Express", "MongoDB", "Firebase", "SQL", "MySQL", "PostgreSQL",
    "Python", "Java", "C++", "Git", "GitHub", "REST API", "GraphQL",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Linux", "CI/CD",
    "Statistics", "Pandas", "NumPy", "Machine Learning", "TensorFlow", "PyTorch",
    "Networking", "Cyber Security", "Ethical Hacking", "DSA"
]


def extract_skills_from_text(text):
    if not text:
        return []
    lower_text = text.lower()
    return [skill for skill in SKILL_DICTIONARY if skill.lower() in lower_text]


# ---------------------------------------------------------
# 3. Fetch listings from Adzuna for a single role category
# ---------------------------------------------------------
def fetch_listings_for_role(role_type, search_term):
    try:
        response = requests.get(ADZUNA_BASE_URL, params={
            "app_id": ADZUNA_APP_ID,
            "app_key": ADZUNA_APP_KEY,
            "what": search_term,
            "where": "india",
            "results_per_page": 20,
            "max_days_old": 30
        })
        response.raise_for_status()
        data = response.json()

        listings = []
        for job in data.get("results", []):
            listings.append({
                "id": job.get("id"),
                "roleType": role_type,
                "title": job.get("title"),
                "company": (job.get("company") or {}).get("display_name", "Company not listed"),
                "location": (job.get("location") or {}).get("display_name", "India"),
                "description": job.get("description"),
                "skills": extract_skills_from_text(job.get("description")),
                "salaryMin": job.get("salary_min"),
                "salaryMax": job.get("salary_max"),
                "applyUrl": job.get("redirect_url"),
                "postedDate": job.get("created"),
                "source": "adzuna",
                "fetchedAt": firestore.SERVER_TIMESTAMP
            })
        return listings
    except Exception as e:
        print(f'Adzuna fetch failed for role "{role_type}":', str(e))
        return []  # fail gracefully — don't break the whole sync for one role


# ---------------------------------------------------------
# 4. Fetch all role categories and write to Firestore
# ---------------------------------------------------------
def sync_all_internships():
    print("[Adzuna Sync] Starting scheduled sync...")
    batch = db.batch()
    total_fetched = 0

    for role_type, search_term in ROLE_SEARCH_TERMS.items():
        listings = fetch_listings_for_role(role_type, search_term)

        for listing in listings:
            doc_ref = db.collection("liveInternships").document(f'{role_type}_{listing["id"]}')
            batch.set(doc_ref, listing, merge=True)
            total_fetched += 1

        # Small delay between role calls to stay well within rate limits
        time.sleep(0.5)

    batch.commit()
    print(f"[Adzuna Sync] Done. {total_fetched} listings synced to Firestore.")
    return total_fetched


# ---------------------------------------------------------
# 5. Match score: student skill profile vs a listing's skills
# ---------------------------------------------------------
def calculate_match_score(student_skills, listing_skills):
    if not listing_skills:
        return 0

    student_set = set(s.lower() for s in student_skills)
    matched = [skill for skill in listing_skills if skill.lower() in student_set]

    score = (len(matched) / len(listing_skills)) * 100
    return round(score)


def get_matched_internships_for_student(student_skills, role_type=None):
    query = db.collection("liveInternships")
    if role_type and role_type != "all":
        query = query.where("roleType", "==", role_type)

    docs = query.get()
    results = []
    for doc in docs:
        data = doc.to_dict()
        data["matchScore"] = calculate_match_score(student_skills, data.get("skills", []))
        results.append(data)

    return sorted(results, key=lambda x: x["matchScore"], reverse=True)


# ---------------------------------------------------------
# 6. Schedule the sync — runs every 6 hours
# ---------------------------------------------------------
def start_scheduled_sync():
    scheduler = BackgroundScheduler()
    scheduler.add_job(
        lambda: sync_all_internships(),
        "cron",
        hour="*/6",
        minute=0
    )
    scheduler.start()
    print("[Adzuna Sync] Scheduled job registered — runs every 6 hours.")