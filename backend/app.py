import json
import os
from datetime import datetime, timezone
from pathlib import Path

import joblib
import pandas as pd

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_login import (
    LoginManager,
    UserMixin,
    current_user,
    login_required,
    login_user,
    logout_user
)
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError

from werkzeug.security import (
    check_password_hash,
    generate_password_hash
)

# ==========================================
# Flask Application
# ==========================================

load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parent.parent

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv( "DATABASE_URL",
    "sqlite:///careercompass.db")

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"
app.config["REMEMBER_COOKIE_HTTPONLY"] = True
app.config["REMEMBER_COOKIE_SAMESITE"] = "Lax"

if not app.config["SECRET_KEY"]:
    raise RuntimeError(
        "SECRET_KEY is missing from the .env file."
    )

CORS(app,
    supports_credentials=True,
    origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:5000",
        "http://localhost:5000"
    ]
    )

db = SQLAlchemy(app)

login_manager = LoginManager(app)

# ==========================================
# Database Models
# ==========================================

class User(UserMixin, db.Model):

    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(255),
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    education = db.Column(
        db.String(100),
        nullable=True
    )

    course = db.Column(
        db.String(100),
        nullable=True
    )

    semester = db.Column(
        db.String(50),
        nullable=True
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    profile = db.relationship(
        "CareerProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )


class CareerProfile(db.Model):

    __tablename__ = "career_profiles"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        unique=True,
        nullable=False,
        index=True
    )

    career_result = db.Column(
        db.JSON,
        nullable=True
    )

    resume_data = db.Column(
        db.JSON,
        nullable=True
    )

    resume_analysis = db.Column(
        db.JSON,
        nullable=True
    )

    github_analysis = db.Column(
        db.JSON,
        nullable=True
    )

    roadmap_progress = db.Column(
        db.JSON,
        nullable=True
    )

    planner_data = db.Column(
        db.JSON,
        nullable=True
    )

    resume_score = db.Column(
        db.Float,
        nullable=True
    )

    github_score = db.Column(
        db.Float,
        nullable=True
    )

    onboarding_step = db.Column(
        db.String(100),
        default="career-assessment",
        nullable=False
    )

    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    user = db.relationship(
        "User",
        back_populates="profile"
    )

# ==========================================
# Interview Attempt Model
# ==========================================

class InterviewAttempt(db.Model):
    __tablename__ = "interview_attempts"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    track = db.Column(
        db.String(80),
        nullable=False
    )

    round_type = db.Column(
        db.String(30),
        nullable=False
    )

    difficulty = db.Column(
        db.String(30),
        nullable=False
    )

    readiness_score = db.Column(
        db.Integer,
        nullable=False
    )

    communication_score = db.Column(
        db.Float,
        nullable=False
    )

    technical_score = db.Column(
        db.Float,
        nullable=False
    )

    confidence_score = db.Column(
        db.Float,
        nullable=False
    )

    strengths = db.Column(
        db.JSON,
        nullable=False,
        default=list
    )

    improvements = db.Column(
        db.JSON,
        nullable=False,
        default=list
    )

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    VALID_INTERVIEW_TRACKS = {
    "Frontend Developer",
    "Backend Developer",
    "Data Analyst / ML"
}



VALID_INTERVIEW_ROUNDS = {
    "HR",
    "Technical",
    "Coding"
}

VALID_INTERVIEW_DIFFICULTIES = {
    "Beginner",
    "Intermediate",
    "Advanced"
}


def serialize_interview_attempt(attempt):
    strengths = (
        attempt.strengths
        if isinstance(attempt.strengths, list)
        else []
    )

    improvements = (
        attempt.improvements
        if isinstance(attempt.improvements, list)
        else []
    )

    return {
        "id": attempt.id,
        "track": attempt.track,
        "round": attempt.round_type,
        "difficulty": attempt.difficulty,
        "readinessScore": attempt.readiness_score,
        "communication": attempt.communication_score,
        "technical": attempt.technical_score,
        "confidence": attempt.confidence_score,
        "strengths": strengths,
        "improvements": improvements,
        "date": (
            attempt.created_at.isoformat()
            if attempt.created_at
            else None
        )
    }

VALID_INTERVIEW_TRACKS = {
    "Frontend Developer",
    "Backend Developer",
    "Data Analyst / ML"
}


VALID_INTERVIEW_ROUNDS = {
    "HR",
    "Technical",
    "Coding"
}

VALID_INTERVIEW_DIFFICULTIES = {
    "Beginner",
    "Intermediate",
    "Advanced"
}

def get_or_create_career_profile(user_id):
    """Return the authenticated user's career profile."""
    profile = CareerProfile.query.filter_by(user_id=user_id).first()

    if profile is None:
        profile = CareerProfile(user_id=user_id)
        db.session.add(profile)
        db.session.commit()

    return profile

VALID_PLANNER_DAYS = {
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
}

VALID_PLANNER_PRIORITIES = {"High", "Medium", "Low"}


def validate_planner_payload(payload):
    """Validate and clean Planner data before storing it."""

    if not isinstance(payload, dict):
        return None, "Planner data must be a JSON object."

    raw_tasks = payload.get("tasks", [])

    if not isinstance(raw_tasks, list):
        return None, "Tasks must be a list."

    if len(raw_tasks) > 250:
        return None, "A maximum of 250 tasks is allowed."

    clean_tasks = []

    for index, task in enumerate(raw_tasks):
        if not isinstance(task, dict):
            return None, f"Task {index + 1} is invalid."

        title = str(task.get("title", "")).strip()
        category = str(task.get("category", "General")).strip()
        day = str(task.get("day", "")).strip()
        priority = str(task.get("priority", "Medium")).strip()

        if not title:
            return None, f"Task {index + 1} requires a title."

        if len(title) > 120:
            return None, f"Task {index + 1} title is too long."

        if len(category) > 50:
            return None, f"Task {index + 1} category is too long."

        if day not in VALID_PLANNER_DAYS:
            return None, f"Task {index + 1} contains an invalid day."

        if priority not in VALID_PLANNER_PRIORITIES:
            return None, f"Task {index + 1} contains an invalid priority."

        try:
            task_id = int(task.get("id"))
        except (TypeError, ValueError):
            return None, f"Task {index + 1} contains an invalid ID."

        clean_tasks.append({
            "id": task_id,
            "title": title,
            "category": category or "General",
            "day": day,
            "priority": priority,
            "done": bool(task.get("done", False))
        })

    raw_xp = payload.get("xp", {})
    raw_streak = payload.get("streak", {})

    if not isinstance(raw_xp, dict):
        raw_xp = {}

    if not isinstance(raw_streak, dict):
        raw_streak = {}

    try:
        xp_value = max(0, int(raw_xp.get("xp", 0)))
    except (TypeError, ValueError):
        xp_value = 0

    try:
        streak_count = max(0, int(raw_streak.get("count", 0)))
    except (TypeError, ValueError):
        streak_count = 0

    last_date = raw_streak.get("lastDate")

    if last_date is not None:
        last_date = str(last_date)[:50]

    clean_data = {
        "tasks": clean_tasks,
        "xp": {
            "xp": min(xp_value, 1000000)
        },
        "streak": {
            "count": min(streak_count, 100000),
            "lastDate": last_date
        }
    }

    return clean_data, None

# ==========================================
# Flask-Login User Loader
# ==========================================

@login_manager.user_loader
def load_user(user_id):

    try:
        return db.session.get(
            User,
            int(user_id)
        )

    except (TypeError, ValueError):
        return None


@login_manager.unauthorized_handler
def unauthorized_user():

    return jsonify({
        "status": "error",
        "message": "Authentication is required."
    }), 401

# ==========================================
# Authentication Helpers
# ==========================================

def serialize_user(user):

    profile = user.profile

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "education": user.education,
        "course": user.course,
        "semester": user.semester,
        "onboarding_step": (
            profile.onboarding_step
            if profile
            else "career-assessment"
        )
    }


def get_json_body():

    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return {}

    return data

# ==========================================
# Create Database Tables
# ==========================================

with app.app_context():

    db.create_all()

    print("CareerCompass database tables ready.")

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
# Frontend Routes
# ==========================================

@app.route("/", methods=["GET"])
@app.route("/index.html", methods=["GET"])
def home():
    return send_from_directory(
        str(PROJECT_ROOT),
        "index.html"
    )


@app.route("/pages/<path:filename>", methods=["GET"])
def serve_page(filename):
    return send_from_directory(
        str(PROJECT_ROOT / "pages"),
        filename
    )


@app.route("/css/<path:filename>", methods=["GET"])
def serve_css(filename):
    return send_from_directory(
        str(PROJECT_ROOT / "css"),
        filename
    )


@app.route("/js/<path:filename>", methods=["GET"])
def serve_javascript(filename):
    return send_from_directory(
        str(PROJECT_ROOT / "js"),
        filename
    )


@app.route("/assets/<path:filename>", methods=["GET"])
def serve_asset(filename):
    return send_from_directory(
        str(PROJECT_ROOT / "assets"),
        filename
    )


@app.route("/images/<path:filename>", methods=["GET"])
def serve_image(filename):
    return send_from_directory(
        str(PROJECT_ROOT / "images"),
        filename
    )


# ==========================================
# Signup Route
# ==========================================

@app.route("/api/signup", methods=["POST"])
def signup():

    if current_user.is_authenticated:
        return jsonify({
            "status": "error",
            "message": "You are already logged in."
        }), 400

    data = get_json_body()

    name = str(
        data.get("name", "")
    ).strip()

    email = str(
        data.get("email", "")
    ).strip().lower()

    password = str(
        data.get("password", "")
    )

    education = str(
        data.get("education", "")
    ).strip()

    course = str(
        data.get("course", "")
    ).strip()

    semester = str(
        data.get("semester", "")
    ).strip()


    if not name:
        return jsonify({
            "status": "error",
            "message": "Full name is required."
        }), 400


    if (
        not email
        or "@" not in email
        or "." not in email.split("@")[-1]
    ):
        return jsonify({
            "status": "error",
            "message": "Enter a valid email address."
        }), 400


    if len(password) < 8:
        return jsonify({
            "status": "error",
            "message": (
                "Password must contain at least "
                "8 characters."
            )
        }), 400


    if len(password) > 128:
        return jsonify({
            "status": "error",
            "message": "Password is too long."
        }), 400


    existing_user = db.session.scalar(
        db.select(User).where(
            User.email == email
        )
    )

    if existing_user:
        return jsonify({
            "status": "error",
            "message": (
                "An account with this email "
                "already exists."
            )
        }), 409


    user = User(
        name=name,
        email=email,
        password_hash=generate_password_hash(
            password
        ),
        education=education or None,
        course=course or None,
        semester=semester or None
    )


    try:
        db.session.add(user)
        db.session.flush()

        profile = CareerProfile(
            user_id=user.id,
            onboarding_step="career-assessment"
        )

        db.session.add(profile)
        db.session.commit()

    except IntegrityError:
        db.session.rollback()

        return jsonify({
            "status": "error",
            "message": (
                "An account with this email "
                "already exists."
            )
        }), 409

    except Exception as error:
        db.session.rollback()

        print("Signup error:", error)

        return jsonify({
            "status": "error",
            "message": (
                "Account could not be created."
            )
        }), 500


    login_user(
        user,
        remember=True
    )

    return jsonify({
        "status": "success",
        "message": "Account created successfully.",
        "user": serialize_user(user),
        "redirect": "/pages/dashboard.html"
    }), 201

# ==========================================
# Login Route
# ==========================================

@app.route("/api/login", methods=["POST"])
def login():

    if current_user.is_authenticated:
        return jsonify({
            "status": "success",
            "message": "You are already logged in.",
            "user": serialize_user(current_user),
            "redirect": "/pages/dashboard.html"
        }), 200

    data = get_json_body()

    email = str(
        data.get("email", "")
    ).strip().lower()

    password = str(
        data.get("password", "")
    )

    remember = bool(
        data.get("remember", True)
    )


    if not email or not password:
        return jsonify({
            "status": "error",
            "message": (
                "Email and password are required."
            )
        }), 400


    user = db.session.scalar(
        db.select(User).where(
            User.email == email
        )
    )


    if (
        user is None
        or not check_password_hash(
            user.password_hash,
            password
        )
    ):
        return jsonify({
            "status": "error",
            "message": "Invalid email or password."
        }), 401


    login_user(
        user,
        remember=remember
    )

    return jsonify({
        "status": "success",
        "message": "Login successful.",
        "user": serialize_user(user),
        "redirect": "/pages/dashboard.html"
    }), 200

# ==========================================
# Logout Route
# ==========================================

@app.route("/api/logout", methods=["POST"])
@login_required
def logout():

    logout_user()

    return jsonify({
        "status": "success",
        "message": "Logout successful.",
        "redirect": "/"
    }), 200


# ==========================================
# Current User Route
# ==========================================

@app.route("/api/me", methods=["GET"])
def get_current_user():

    if not current_user.is_authenticated:

        return jsonify({
            "status": "success",
            "authenticated": False,
            "user": None
        }), 200

    return jsonify({
        "status": "success",
        "authenticated": True,
        "user": serialize_user(current_user)
    }), 200

@app.route("/api/planner", methods=["GET"])
@login_required
def get_planner():
    try:
        profile = get_or_create_career_profile(current_user.id)

        planner = {
            "tasks": [],
            "xp": {"xp": 0},
            "streak": {
                "count": 0,
                "lastDate": None
            }
        }

        if profile.planner_data:
            stored_data = profile.planner_data

            if isinstance(stored_data, str):
                try:
                    stored_data = json.loads(stored_data)
                except (json.JSONDecodeError, TypeError):
                    stored_data = {}

                    app.logger.warning(
                        "Invalid planner data for user %s",
                        current_user.id
                    )

            if isinstance(stored_data, dict):
                planner.update(stored_data)

        return jsonify({
            "status": "success",
            "planner": planner
        }), 200

    except Exception:
        app.logger.exception("Unable to load Planner data")

        return jsonify({
            "status": "error",
            "message": "Unable to load Planner data."
        }), 500

# authenticated API routes---------/
@app.route("/api/planner", methods=["PUT"])
@login_required
def update_planner():
    payload = request.get_json(silent=True)

    clean_data, validation_error = validate_planner_payload(payload)

    if validation_error:
        return jsonify({
            "status": "error",
            "message": validation_error
        }), 400

    try:
        profile = get_or_create_career_profile(current_user.id)

        profile.planner_data = clean_data
        profile.updated_at = datetime.now(timezone.utc)

        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Planner saved successfully.",
            "planner": clean_data
        }), 200

    except Exception:
        db.session.rollback()
        app.logger.exception("Unable to save Planner data")

        return jsonify({
            "status": "error",
            "message": "Unable to save Planner data."
        }), 500

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

# add authenticated api

@app.route("/api/interview-attempts", methods=["GET"])
@login_required
def get_interview_attempts():
    try:
        attempts = (
            InterviewAttempt.query
            .filter_by(user_id=current_user.id)
            .order_by(InterviewAttempt.created_at.desc())
            .limit(20)
            .all()
        )

        return jsonify({
            "status": "success",
            "attempts": [
                serialize_interview_attempt(attempt)
                for attempt in attempts
            ]
        }), 200

    except Exception:
        app.logger.exception("Unable to load interview attempts")

        return jsonify({
            "status": "error",
            "message": "Unable to load interview history."
        }), 500


@app.route("/api/interview-attempts", methods=["POST"])
@login_required
def create_interview_attempt():
    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        return jsonify({
            "status": "error",
            "message": "Invalid interview data."
        }), 400

    track = str(payload.get("track", "")).strip()
    round_type = str(payload.get("round", "")).strip()
    difficulty = str(payload.get("difficulty", "")).strip()

    if track not in VALID_INTERVIEW_TRACKS:
        return jsonify({
            "status": "error",
            "message": "Invalid career track."
        }), 400

    if round_type not in VALID_INTERVIEW_ROUNDS:
        return jsonify({
            "status": "error",
            "message": "Invalid interview round."
        }), 400

    if difficulty not in VALID_INTERVIEW_DIFFICULTIES:
        return jsonify({
            "status": "error",
            "message": "Invalid difficulty."
        }), 400

    try:
        readiness_score = int(payload.get("readinessScore"))
        communication_score = float(payload.get("communication"))
        technical_score = float(payload.get("technical"))
        confidence_score = float(payload.get("confidence"))
    except (TypeError, ValueError):
        return jsonify({
            "status": "error",
            "message": "Interview scores are invalid."
        }), 400

    if not 0 <= readiness_score <= 100:
        return jsonify({
            "status": "error",
            "message": "Readiness score must be between 0 and 100."
        }), 400

    for score in (
        communication_score,
        technical_score,
        confidence_score
    ):
        if not 1 <= score <= 5:
            return jsonify({
                "status": "error",
                "message": "Category scores must be between 1 and 5."
            }), 400

    strengths = payload.get("strengths", [])
    improvements = payload.get("improvements", [])

    if not isinstance(strengths, list):
        strengths = []

    if not isinstance(improvements, list):
        improvements = []

    strengths = [
        str(item).strip()[:250]
        for item in strengths[:10]
        if str(item).strip()
    ]

    improvements = [
        str(item).strip()[:250]
        for item in improvements[:10]
        if str(item).strip()
    ]

    try:
        attempt = InterviewAttempt(
            user_id=current_user.id,
            track=track,
            round_type=round_type,
            difficulty=difficulty,
            readiness_score=readiness_score,
            communication_score=communication_score,
            technical_score=technical_score,
            confidence_score=confidence_score,
            strengths=strengths,
            improvements=improvements
        )

        db.session.add(attempt)
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": "Interview attempt saved successfully.",
            "attempt": serialize_interview_attempt(attempt)
        }), 201

    except Exception:
        db.session.rollback()
        app.logger.exception("Unable to save interview attempt")

        return jsonify({
            "status": "error",
            "message": "Unable to save interview attempt."
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