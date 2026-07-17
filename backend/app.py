import os
import joblib
import pandas as pd

from flask import Flask, jsonify, request
from flask_cors import CORS


# ==========================================
# Flask Application
# ==========================================

app = Flask(__name__)

CORS(app)


# ==========================================
# File Paths
# ==========================================

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

MODEL_FILE = os.path.join(
    BASE_DIR,
    "models",
    "career_model_v4.pkl"
)

FEATURE_FILE = os.path.join(
    BASE_DIR,
    "models",
    "career_features_v4.pkl"
)


# ==========================================
# Load Model and Feature Schema
# ==========================================

print("Loading CareerCompass ML model...")

try:
    model = joblib.load(MODEL_FILE)

    features = joblib.load(FEATURE_FILE)

    print("Model loaded successfully.")
    print("Model file:", MODEL_FILE)
    print("Number of features:", len(features))

except FileNotFoundError as error:
    print("Model file was not found.")
    print(error)

    model = None
    features = []


# ==========================================
# Home Route
# ==========================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "CareerCompass ML API is running",
        "status": "success",
        "model_version": "V4"
    })


# ==========================================
# Health Check Route
# ==========================================

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "feature_count": len(features)
    })


# ==========================================
# Feature Schema Route
# ==========================================

@app.route("/features", methods=["GET"])
def get_features():
    return jsonify({
        "feature_count": len(features),
        "features": features
    })


# ==========================================
# Career Prediction Route
# ==========================================

@app.route("/predict", methods=["POST"])
def predict_career():

    if model is None:
        return jsonify({
            "status": "error",
            "message": "ML model is not loaded"
        }), 500

    try:
        input_data = request.get_json()

        if not input_data:
            return jsonify({
                "status": "error",
                "message": "No JSON data was provided"
            }), 400

        prepared_data = {}

        for feature in features:
            value = input_data.get(feature, 0)

            try:
                prepared_data[feature] = float(value)

            except (TypeError, ValueError):
                prepared_data[feature] = 0

        input_dataframe = pd.DataFrame(
            [prepared_data],
            columns=features
        )

        predicted_career = model.predict(
            input_dataframe
        )[0]

        probabilities = model.predict_proba(
            input_dataframe
        )[0]

        probability_results = []

        for career_name, probability in zip(
            model.classes_,
            probabilities
        ):
            probability_results.append({
                "career": career_name,
                "probability": round(
                    float(probability) * 100,
                    2
                )
            })

        probability_results.sort(
            key=lambda item: item["probability"],
            reverse=True
        )

        confidence = probability_results[0]["probability"]

        return jsonify({
            "status": "success",
            "prediction": predicted_career,
            "confidence": confidence,
            "career_probabilities": probability_results,
            "received_features": prepared_data
        })

    except Exception as error:
        return jsonify({
            "status": "error",
            "message": str(error)
        }), 500


# ==========================================
# Run Flask Server
# ==========================================

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )