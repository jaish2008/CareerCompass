from flask import Blueprint, request, jsonify
from adzuna_integration import (
    get_matched_internships_for_student,
    sync_all_internships
)

internship_bp = Blueprint("internship_bp", __name__)


@internship_bp.route("", methods=["GET"])
def get_internships():
    try:
        role_type = request.args.get("roleType")
        skills = request.args.get("skills")
        student_skills = skills.split(",") if skills else []
        matches = get_matched_internships_for_student(student_skills, role_type)
        return jsonify({"count": len(matches), "results": matches})
    except Exception as e:
        print("Failed to fetch matched internships:", str(e))
        return jsonify({"error": "Could not load internships right now."}), 500


@internship_bp.route("/sync", methods=["POST"])
def sync():
    try:
        sync_all_internships()
        return jsonify({"message": "Sync complete"})
    except Exception as e:
        print("SYNC ERROR:", str(e))
        return jsonify({"error": "Sync failed"}), 500