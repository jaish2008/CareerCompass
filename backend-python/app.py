from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import requests

from assessment_routes import assessment_bp
from roadmap_routes import roadmap_bp

load_dotenv()
app = Flask(__name__)
CORS(app)

app.register_blueprint(assessment_bp, url_prefix="/api/assessment")
app.register_blueprint(roadmap_bp, url_prefix="/api/roadmap")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

@app.route("/api/ai/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        history = data.get("history", [])
        system_instruction = data.get("systemInstruction", "")
        messages = [{"role": "system", "content": system_instruction}]
        for turn in history:
            role = "assistant" if turn.get("role") == "model" else "user"
            text = " ".join(p.get("text", "") for p in turn.get("parts", []))
            messages.append({"role": role, "content": text})
        response = requests.post(
            GROQ_URL,
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {GROQ_API_KEY}"},
            json={"model": "llama-3.3-70b-versatile", "messages": messages}
        )
        response.raise_for_status()
        result = response.json()
        reply = result["choices"][0]["message"]["content"]
        return jsonify({"reply": reply})
    except Exception as e:
        print("Chat error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5002))
    app.run(port=port, debug=True)