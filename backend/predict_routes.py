"""
predict_routes.py — the ONE shared /predict endpoint, aligned to
career_model_v4.pkl / career_features_v4.pkl produced by your train_model.py.

Save this file in backend-python/, next to ai_routes.py and app.py.

In app.py, register it:

    from predict_routes import predict_bp
    app.register_blueprint(predict_bp)

That's it — no other setup needed as long as models/career_model_v4.pkl
and models/career_features_v4.pkl already exist (i.e. you've run your
train_model.py at least once).
"""

import os

import joblib
import numpy as np
from flask import Blueprint, jsonify, request

predict_bp = Blueprint("predict_bp", __name__)

# this file lives in backend/, but train_model.py saves models one level
# up, at the project root: CareerCompass/models/
_BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.dirname(_BACKEND_DIR)
_MODEL_FILE = os.path.join(_PROJECT_ROOT, "models", "career_model_v4.pkl")
_FEATURE_FILE = os.path.join(_PROJECT_ROOT, "models", "career_features_v4.pkl")

_model = None
_feature_names = None


def _load():
    """Lazy-load once per process, not once per request."""
    global _model, _feature_names
    if _model is None:
        _model = joblib.load(_MODEL_FILE)
        _feature_names = joblib.load(_FEATURE_FILE)  # this is a plain list
    return _model, _feature_names


def _features_to_vector(payload_features, feature_names):
    """
    Accepts either:
      - a dict:  {"html_css": 1, "javascript": 1, ...}
      - a list:  [1, 1, 0, ...]  (must already match feature_names order)
    Missing keys in a dict default to 0 (e.g. quiz doesn't ask about every
    one of the 36 skills/platforms — github.js's language stats will fill
    in more of them than the quiz can).
    """
    if isinstance(payload_features, dict):
        vector = [float(payload_features.get(name, 0)) for name in feature_names]
    elif isinstance(payload_features, list):
        if len(payload_features) != len(feature_names):
            raise ValueError(
                f"Expected {len(feature_names)} features, got {len(payload_features)}"
            )
        vector = [float(v) for v in payload_features]
    else:
        raise ValueError("'features' must be an object or an array")
    return np.array(vector).reshape(1, -1)


@predict_bp.route("/predict", methods=["POST"])
def predict():
    model, feature_names = _load()

    body = request.get_json(silent=True) or {}
    features = body.get("features")
    if features is None:
        return jsonify({"error": "Missing 'features' in request body"}), 400

    try:
        vector = _features_to_vector(features, feature_names)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    probabilities = model.predict_proba(vector)[0]
    ranked = sorted(
        zip(model.classes_, probabilities), key=lambda pair: pair[1], reverse=True
    )

    return jsonify(
        {
            "primaryCareer": ranked[0][0],
            "confidence": round(float(ranked[0][1]), 4),
            "usedML": True,
            "predictions": [
                {"career": career, "probability": round(float(p), 4)}
                for career, p in ranked
            ],
        }
    )