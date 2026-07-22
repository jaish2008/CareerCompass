import json
from datetime import datetime
import os
import joblib

from flask import Blueprint, request, jsonify
from database import get_db_connection


assessment_bp = Blueprint("assessment", __name__)

MODEL_PATH = os.path.join(os.path.dirname(__file__), "placement_model.pkl")
FEATURES_PATH = os.path.join(os.path.dirname(__file__), "placement_model_features.pkl")

model = joblib.load(MODEL_PATH)
FEATURE_COLUMNS = joblib.load(FEATURES_PATH)


def skill_to_level(value):
    """Map a self-rated skill string to the 1/2/3 scale the model was
    trained on. Unknown/missing defaults to 2 (Intermediate) — NOT 0,
    since 0 is outside the training range and biases every prediction
    toward the negative class."""
    mapping = {"Beginner": 1, "Intermediate": 2, "Advanced": 3}
    return mapping.get(value, 2)


def safe_float(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def safe_int_count(value, default=0):
    """Handles numeric counts. If a non-numeric value was entered (e.g.
    a GitHub profile URL instead of a repo count), treat any non-empty
    value as 'has at least one repo' instead of defaulting to 0."""
    if value is None:
        return default
    s = str(value).strip()
    if s.isdigit():
        return int(s)
    return 1 if s else default


@assessment_bp.route("/", methods=["POST"])
def save_assessment():

    data = request.get_json()

    # ---------------- ML INPUT ----------------

    feature_row = {
        "cgpa": safe_float(data.get("cgpa")),
        "coding_level": skill_to_level(data.get("programming")),
        "communication_level": skill_to_level(data.get("communication")),
        "logical_level": skill_to_level(data.get("dsa")),
        "projects_count": safe_int_count(data.get("projects")),
        "github_repos": safe_int_count(data.get("github")),
        "study_hours_per_day": safe_float(data.get("study_hours")),
    }

    prediction_data = [[feature_row[col] for col in FEATURE_COLUMNS]]

    # ---------------- PREDICTION ----------------

    prediction = model.predict(prediction_data)[0]
    probability = model.predict_proba(prediction_data)[0]

    # probability[1] = P(Placed). Verify against the target_encoder
    # printout from train_model.py — swap the index if it's reversed.
    placement_probability = probability[1] if len(probability) > 1 else probability[0]

    confidence = round(max(probability) * 100, 2)
    readiness_percentage = round(placement_probability * 100, 2)

    placement_status = "High chance of placement" if prediction == 1 else "Need more improvement"

    # ---------------- DOMAIN RECOMMENDATION ----------------

    programming_level = skill_to_level(data.get("programming"))
    web_level = skill_to_level(data.get("web"))
    dsa_level = skill_to_level(data.get("dsa"))

    if programming_level >= 2 and web_level >= 2:
        domain = "Web Development"
    elif dsa_level >= 2:
        domain = "Software Development / DSA"
    else:
        domain = "AI / ML Foundation"

    # ---------------- IMPROVEMENT SUGGESTIONS ----------------

    suggestions = []
    if feature_row["coding_level"] < 2:
        suggestions.append("Strengthen core programming fundamentals with daily coding practice.")
    if feature_row["logical_level"] < 2:
        suggestions.append("Practice DSA problems on LeetCode or GeeksforGeeks.")
    if feature_row["communication_level"] < 2:
        suggestions.append("Join mock interviews or group discussions to build communication skills.")
    if feature_row["projects_count"] < 2:
        suggestions.append("Build 2-3 more portfolio-worthy projects.")
    if feature_row["github_repos"] < 1:
        suggestions.append("Start publishing projects on GitHub to build a visible portfolio.")
    if feature_row["study_hours_per_day"] < 2:
        suggestions.append("Increase consistent daily study/practice time.")
    if feature_row["cgpa"] < 7:
        suggestions.append("Work on improving academic performance where possible.")
    if not suggestions:
        suggestions.append("Strong profile — keep refining projects and preparing for interviews.")

    # ---------------- DATABASE SAVE ----------------

    # ---------------- DATABASE SAVE ----------------

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO student_assessment
        (name, department, semester, cgpa, programming, dsa, web,
         database_skill, communication, career, study_hours, projects, github,
         prediction, placement_readiness, confidence_score, recommended_domain,
         suggestions, assessment_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.get("name"), data.get("department"), data.get("semester"),
        data.get("cgpa"), data.get("programming"), data.get("dsa"),
        data.get("web"), data.get("database_skill"), data.get("communication"),
        data.get("career"), data.get("study_hours"), data.get("projects"),
        data.get("github"),
        int(prediction), readiness_percentage, confidence, domain,
        json.dumps(suggestions), datetime.now().isoformat()
    ))
    conn.commit()
    conn.close()
    # ---------------- RESPONSE ----------------

    return jsonify({
        "success": True,
        "message": "Assessment saved successfully!",
        "prediction": int(prediction),
        "placement_status": placement_status,
        "confidence": confidence,
        "readiness_percentage": readiness_percentage,
        "recommended_domain": domain,
        "improvement_suggestions": suggestions
    })