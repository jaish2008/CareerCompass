from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials
import os
import json
import traceback

load_dotenv()

# --- Firebase setup ---
firebase_service_account = os.getenv("FIREBASE_SERVICE_ACCOUNT")
if firebase_service_account:
    service_account_dict = json.loads(firebase_service_account)
    cred = credentials.Certificate(service_account_dict)
else:
    cred = credentials.Certificate("./serviceAccountKey.json")

firebase_admin.initialize_app(cred)

# --- Flask app setup ---
app = Flask(__name__)
CORS(app)

# --- Routes (to be created) ---
from internship_routes import internship_bp
app.register_blueprint(internship_bp, url_prefix="/api/internships")

from ai_routes import ai_bp
app.register_blueprint(ai_bp, url_prefix="/api/ai")

# --- Scheduled Adzuna sync ---
from adzuna_integration import start_scheduled_sync
start_scheduled_sync()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    print(f"Server running on http://localhost:{port}")
    app.run(port=port, debug=True)