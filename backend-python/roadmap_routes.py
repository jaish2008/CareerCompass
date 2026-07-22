import json
from flask import Blueprint, jsonify
from database import get_db_connection

roadmap_bp = Blueprint("roadmap", __name__)


@roadmap_bp.route("/", methods=["GET"])
def get_roadmap():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM roadmap")
    rows = cursor.fetchall()

    conn.close()

    roadmap = []
    for row in rows:
        roadmap.append({
            "id": row["id"],
            "career_name": row["career_name"],
            "step_number": row["step_number"],
            "title": row["title"],
            "description": row["description"]
        })

    return jsonify(roadmap)


@roadmap_bp.route("/latest", methods=["GET"])
def get_latest_roadmap():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT * FROM student_assessment
        WHERE recommended_domain IS NOT NULL
        ORDER BY id DESC
        LIMIT 1
    """)
    latest = cursor.fetchone()

    if latest is None:
        conn.close()
        return jsonify({"has_assessment": False})

    domain = latest["recommended_domain"]

    cursor.execute("""
        SELECT * FROM roadmap
        WHERE career_name = ?
        ORDER BY step_number ASC
    """, (domain,))
    steps = cursor.fetchall()

    conn.close()

    roadmap_steps = [
        {
            "id": row["id"],
            "step_number": row["step_number"],
            "title": row["title"],
            "description": row["description"]
        }
        for row in steps
    ]

    try:
        suggestions = json.loads(latest["suggestions"]) if latest["suggestions"] else []
    except (json.JSONDecodeError, TypeError):
        suggestions = []

    return jsonify({
        "has_assessment": True,
        "recommended_domain": domain,
        "placement_status": "High chance of placement" if latest["prediction"] == 1 else "Need more improvement",
        "placement_readiness": latest["placement_readiness"],
        "confidence_score": latest["confidence_score"],
        "assessment_date": latest["assessment_date"],
        "suggestions": suggestions,
        "roadmap_steps": roadmap_steps
    })