import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")
ADZUNA_BASE_URL = "https://api.adzuna.com/v1/api/jobs/in/search/1"

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
                "id": str(job.get("id")),
                "roleType": role_type,
                "title": job.get("title"),
                "company": (job.get("company") or {}).get("display_name", "Company not listed"),
                "location": (job.get("location") or {}).get("display_name", "India"),
                "description": job.get("description"),
                "skills": extract_skills_from_text(job.get("description")),
                "salaryMin": job.get("salary_min"),
                "salaryMax": job.get("salary_max"),
                "applyUrl": job.get("redirect_url"),
                "postedDate": job.get("created")
            })
        return listings
    except Exception as e:
        print(f'Adzuna fetch failed for role "{role_type}":', str(e))
        return []


def sync_all_internships():
    # Deferred import avoids a circular import with app.py
    from app import db, Internship

    print("[Adzuna Sync] Starting scheduled sync...")
    total_fetched = 0

    for role_type, search_term in ROLE_SEARCH_TERMS.items():
        listings = fetch_listings_for_role(role_type, search_term)

        for listing in listings:
            existing = Internship.query.filter_by(
                external_id=listing["id"],
                role_type=role_type
            ).first()

            if existing:
                existing.title = listing["title"]
                existing.company = listing["company"]
                existing.location = listing["location"]
                existing.description = listing["description"]
                existing.skills = listing["skills"]
                existing.salary_min = listing["salaryMin"]
                existing.salary_max = listing["salaryMax"]
                existing.apply_url = listing["applyUrl"]
                existing.posted_date = listing["postedDate"]
            else:
                db.session.add(Internship(
                    external_id=listing["id"],
                    role_type=role_type,
                    title=listing["title"],
                    company=listing["company"],
                    location=listing["location"],
                    description=listing["description"],
                    skills=listing["skills"],
                    salary_min=listing["salaryMin"],
                    salary_max=listing["salaryMax"],
                    apply_url=listing["applyUrl"],
                    posted_date=listing["postedDate"]
                ))

            total_fetched += 1

        db.session.commit()
        time.sleep(0.5)

    print(f"[Adzuna Sync] Done. {total_fetched} listings synced.")
    return total_fetched


def calculate_match_score(student_skills, listing_skills):
    if not listing_skills:
        return 0
    student_set = set(s.lower() for s in student_skills)
    matched = [skill for skill in listing_skills if skill.lower() in student_set]
    return round((len(matched) / len(listing_skills)) * 100)


def get_matched_internships_for_student(student_skills, role_type=None):
    from app import Internship

    query = Internship.query
    if role_type and role_type != "all":
        query = query.filter_by(role_type=role_type)

    results = []
    for item in query.all():
        data = item.to_dict()
        data["matchScore"] = calculate_match_score(student_skills, data.get("skills", []))
        results.append(data)

    return sorted(results, key=lambda x: x["matchScore"], reverse=True)


def start_scheduled_sync():
    from apscheduler.schedulers.background import BackgroundScheduler
    scheduler = BackgroundScheduler()
    scheduler.add_job(lambda: sync_all_internships(), "cron", hour="*/6", minute=0)
    scheduler.start()
    print("[Adzuna Sync] Scheduled job registered — runs every 6 hours.")