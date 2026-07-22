from flask import Blueprint, request, jsonify
from gemini_service import (
    generate_career_quiz,
    generate_recommendation,
    generate_learning_plan,
    chat_reply,
    generate_interview_questions,
    grade_interview_answer
)

ai_bp = Blueprint("ai_bp", __name__)

@ai_bp.route("/quiz", methods=["GET"])
def quiz():
    try:
        count = int(request.args.get("count", 5))
        questions = generate_career_quiz(count)
        return jsonify({"questions": questions})
    except Exception as e:
        print("Quiz generation failed:", str(e))
        return jsonify({"error": "Could not generate quiz right now."}), 500

@ai_bp.route("/recommend", methods=["POST"])
def recommend():
    try:
        data = request.get_json()
        recommendation = generate_recommendation(data)
        return jsonify({"recommendation": recommendation})
    except Exception as e:
        print("Recommendation generation failed:", str(e))
        return jsonify({"error": "Could not generate recommendation right now."}), 500

@ai_bp.route("/learning-plan", methods=["POST"])
def learning_plan():
    try:
        data = request.get_json()
        skill_gaps = data.get("skillGaps")
        plan = generate_learning_plan(skill_gaps)
        return jsonify({"plan": plan})
    except Exception as e:
        print("Learning plan generation failed:", str(e))
        return jsonify({"error": "Could not generate learning plan right now."}), 500

@ai_bp.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        history = data.get("history")
        system_instruction = data.get("systemInstruction")
        reply = chat_reply(history, system_instruction)
        return jsonify({"reply": reply})
    except Exception as e:
        print("Chat route error:", str(e))
        return jsonify({"error": str(e)}), 500

@ai_bp.route("/interview-questions", methods=["POST"])
def interview_questions():
    try:
        data = request.get_json()
        questions = generate_interview_questions(
            data.get("track"), data.get("round"), data.get("difficulty"), data.get("prompt")
        )
        return jsonify({"questions": questions})
    except Exception as e:
        print("Interview questions error:", str(e))
        return jsonify({"error": "Failed to generate questions"}), 500

@ai_bp.route("/grade-answer", methods=["POST"])
def grade_answer():
    try:
        data = request.get_json()
        grade = grade_interview_answer(data.get("prompt"))
        return jsonify(grade)
    except Exception as e:
        print("Grade answer error:", str(e))
        return jsonify({"error": "Failed to grade answer"}), 500