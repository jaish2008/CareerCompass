"""
score_routes.py — /score-answer route for the real interview-answer
scoring model (separate from career_model_v4.pkl — this one scores
answer QUALITY, not career fit).

Save this file in backend/, next to predict_routes.py and app.py.

In app.py, register it:

    from score_routes import score_bp
    app.register_blueprint(score_bp)

Expects interview_score_model.pkl and interview_score_features.pkl to
exist at the project root's models/ folder (same place as the career
model) — move both files there after running train_interview_model.py.
"""

import os

import joblib
import numpy as np
from flask import Blueprint, jsonify, request

score_bp = Blueprint("score_bp", __name__)

_BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.dirname(_BACKEND_DIR)
_MODEL_FILE = os.path.join(_PROJECT_ROOT, "models", "interview_score_model.pkl")
_FEATURE_FILE = os.path.join(_PROJECT_ROOT, "models", "interview_score_features.pkl")

_model = None
_feature_names = None


def _load():
    global _model, _feature_names
    if _model is None:
        _model = joblib.load(_MODEL_FILE)
        _feature_names = joblib.load(_FEATURE_FILE)
    return _model, _feature_names


def _verdict(score):
    if score >= 75:
        return "good"
    if score >= 45:
        return "ok"
    return "weak"


@score_bp.route("/score-answer", methods=["POST"])
def score_answer():
    model, feature_names = _load()

    body = request.get_json(silent=True) or {}
    features = body.get("features")
    if features is None:
        return jsonify({"error": "Missing 'features' in request body"}), 400

    try:
        vector = np.array([float(features.get(name, 0)) for name in feature_names]).reshape(1, -1)
    except (TypeError, ValueError) as e:
        return jsonify({"error": f"Invalid features: {e}"}), 400

    predicted_score = float(model.predict(vector)[0])
    predicted_score = max(0, min(100, round(predicted_score)))

    return jsonify({
        "score": predicted_score,
        "verdict": _verdict(predicted_score),
        "usedML": True
    })