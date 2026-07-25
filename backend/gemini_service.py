#still page name is gemini_service but in actual we use groqkey
import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"


def clean_json(text):
    return text.replace("```json", "").replace("```", "").strip()


def ask_groq(prompt):
    try:
        response = requests.post(
            GROQ_URL,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {GROQ_API_KEY}"
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [{"role": "user", "content": prompt}]
            }
        )
        response.raise_for_status()
        data = response.json()
        text = data.get("choices", [{}])[0].get("message", {}).get("content")
        if not text:
            raise Exception("Groq returned no text")
        return text
    except Exception as e:
        print("Groq API error:", str(e))
        raise Exception("Groq request failed")


# ---------------------------------------------------------
# 1. Career Quiz
# ---------------------------------------------------------
def generate_career_quiz(num_questions=5):
    prompt = f"""
Generate {num_questions} multiple-choice career-interest quiz questions for a
computer science student trying to discover which tech career path fits them
(options: Software Developer, Frontend Developer, Backend Developer, Full
Stack Developer, Data Scientist, AI/ML Engineer, Cyber Security, Cloud
Engineer). Each question should reveal a preference (e.g. "Do you enjoy
visual design or solving logic puzzles more?"), not test factual knowledge.

Respond ONLY with valid JSON, no markdown, no preamble, in this exact shape:
[
  {{
    "question": "string",
    "options": [
      {{ "text": "string", "leansTowards": "frontend" }},
      {{ "text": "string", "leansTowards": "backend" }}
    ]
  }}
]
Use these exact category keys for "leansTowards": software, frontend,
backend, fullstack, datascience, aiml, cybersecurity, cloud.
Each question should have 3-4 options.
"""
    raw = ask_groq(prompt)
    return json.loads(clean_json(raw))


# ---------------------------------------------------------
# 2. AI Recommendation
# ---------------------------------------------------------
def generate_recommendation(student_profile):
    skills = student_profile.get("skills", [])
    quiz_result = student_profile.get("quizResult")
    top_match_role = student_profile.get("topMatchRole")

    prompt = f"""
You are a supportive career advisor for a computer science student.

Their tracked skills: {', '.join(skills) if skills else 'none tracked yet'}.
{f"Their career quiz result leans toward: {quiz_result}." if quiz_result else ""}
{f"Their best-matched internship category is: {top_match_role}." if top_match_role else ""}

Write a short, warm, specific recommendation (120-160 words) covering:
1. Which career path(s) currently fit them best and why, referencing their
   actual skills/quiz result above (don't be generic).
2. One concrete next skill they should learn.
3. One encouraging closing line.

Write in plain text, no markdown headers, no bullet points, just 2-3 short
paragraphs a student would read on a dashboard card.
"""
    return ask_groq(prompt)


# ---------------------------------------------------------
# 3. Learning Hub
# ---------------------------------------------------------
def generate_learning_plan(skill_gaps=None):
    skill_gaps = skill_gaps or []
    prompt = f"""
A computer science student needs to learn these skills: {', '.join(skill_gaps) if skill_gaps else 'general programming fundamentals'}.

For each skill, suggest what to learn first (2-3 sub-topics) and one type of
free resource to use (e.g. "freeCodeCamp course", "official docs", "YouTube
crash course") — do not invent specific URLs, just resource types/platform
names since you cannot verify live links.

Respond ONLY with valid JSON, no markdown, no preamble, in this exact shape:
[
  {{
    "skill": "string",
    "subtopics": ["string", "string"],
    "resourceSuggestion": "string",
    "estimatedWeeks": number
  }}
]
"""
    raw = ask_groq(prompt)
    return json.loads(clean_json(raw))


# ---------------------------------------------------------
# 4. Chat
# ---------------------------------------------------------
def chat_reply(history, system_instruction):
    try:
        messages = [{"role": "system", "content": system_instruction}]
        for turn in history:
            role = "assistant" if turn.get("role") == "model" else "user"
            text = " ".join(p.get("text", "") for p in turn.get("parts", []))
            messages.append({"role": role, "content": text})

        response = requests.post(
            GROQ_URL,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {GROQ_API_KEY}"
            },
            json={"model": "llama-3.3-70b-versatile", "messages": messages}
        )
        response.raise_for_status()
        data = response.json()
        text = data.get("choices", [{}])[0].get("message", {}).get("content")
        if not text:
            raise Exception("Groq returned no text")
        return text
    except Exception as e:
        print("Chat Groq error:", str(e))
        raise e


# ---------------------------------------------------------
# 5. Interview Questions
# ---------------------------------------------------------
def generate_interview_questions(track, round_, difficulty, prompt):
    raw = ask_groq(prompt)
    return json.loads(clean_json(raw))


# ---------------------------------------------------------
# 6. Grade Interview Answer
# ---------------------------------------------------------
def grade_interview_answer(prompt):
    raw = ask_groq(prompt)
    return json.loads(clean_json(raw))