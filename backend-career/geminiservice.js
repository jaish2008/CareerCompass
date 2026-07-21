/**
 * geminiService.js
 * ---------------------------------------------------------
 * Backend-only wrapper around the Gemini API. Keeps your
 * GEMINI_API_KEY server-side (never exposed to the browser).
 * Powers three features on the AI Assistant page:
 *   1. Career Quiz      - generates quiz questions
 *   2. AI Recommendation - personalized career advice text
 *   3. Learning Hub      - suggested topics/resources per skill gap
 *
 * Setup:
 *   npm install axios   (already installed from Adzuna setup)
 *
 * .env addition:
 *   GEMINI_API_KEY=your_key_from_aistudio.google.com
 * ---------------------------------------------------------
 */

require('dotenv').config();
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log("Gemini Key Loaded:", GEMINI_API_KEY ? "YES" : "NO");
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Low-level call to Gemini. Sends one prompt, returns the raw text reply.
 */
async function askGemini(prompt) {
  try {
    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API_KEY
        }
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini returned no text');
    return text;
  } catch (err) {
    console.error('Gemini API error:', err.response?.data || err.message);
    throw new Error('Gemini request failed');
  }
}

/**
 * Strips markdown code fences if Gemini wraps JSON in ```json ... ```
 */
function cleanJson(text) {
  return text.replace(/```json|```/g, '').trim();
}

// ---------------------------------------------------------
// 1. Career Quiz — generates N multiple-choice questions
// ---------------------------------------------------------
async function generateCareerQuiz(numQuestions = 5) {
  const prompt = `
Generate ${numQuestions} multiple-choice career-interest quiz questions for a
computer science student trying to discover which tech career path fits them
(options: Software Developer, Frontend Developer, Backend Developer, Full
Stack Developer, Data Scientist, AI/ML Engineer, Cyber Security, Cloud
Engineer). Each question should reveal a preference (e.g. "Do you enjoy
visual design or solving logic puzzles more?"), not test factual knowledge.

Respond ONLY with valid JSON, no markdown, no preamble, in this exact shape:
[
  {
    "question": "string",
    "options": [
      { "text": "string", "leansTowards": "frontend" },
      { "text": "string", "leansTowards": "backend" }
    ]
  }
]
Use these exact category keys for "leansTowards": software, frontend,
backend, fullstack, datascience, aiml, cybersecurity, cloud.
Each question should have 3-4 options.
`;
  const raw = await askGemini(prompt);
  return JSON.parse(cleanJson(raw));
}

// ---------------------------------------------------------
// 2. AI Recommendation — personalized career advice paragraph
// ---------------------------------------------------------
async function generateRecommendation(studentProfile) {
  const { skills = [], quizResult = null, topMatchRole = null } = studentProfile;

  const prompt = `
You are a supportive career advisor for a computer science student.

Their tracked skills: ${skills.join(', ') || 'none tracked yet'}.
${quizResult ? `Their career quiz result leans toward: ${quizResult}.` : ''}
${topMatchRole ? `Their best-matched internship category is: ${topMatchRole}.` : ''}

Write a short, warm, specific recommendation (120-160 words) covering:
1. Which career path(s) currently fit them best and why, referencing their
   actual skills/quiz result above (don't be generic).
2. One concrete next skill they should learn.
3. One encouraging closing line.

Write in plain text, no markdown headers, no bullet points, just 2-3 short
paragraphs a student would read on a dashboard card.
`;
  return await askGemini(prompt);
}

// ---------------------------------------------------------
// 3. Learning Hub — resource topics based on skill gaps
// ---------------------------------------------------------
async function generateLearningPlan(skillGaps = []) {
  const prompt = `
A computer science student needs to learn these skills: ${skillGaps.join(', ') || 'general programming fundamentals'}.

For each skill, suggest what to learn first (2-3 sub-topics) and one type of
free resource to use (e.g. "freeCodeCamp course", "official docs", "YouTube
crash course") — do not invent specific URLs, just resource types/platform
names since you cannot verify live links.

Respond ONLY with valid JSON, no markdown, no preamble, in this exact shape:
[
  {
    "skill": "string",
    "subtopics": ["string", "string"],
    "resourceSuggestion": "string",
    "estimatedWeeks": number
  }
]
`;
  const raw = await askGemini(prompt);
  return JSON.parse(cleanJson(raw));
}

const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function chatReply(history, systemInstruction) {
  try {
    // Groq uses OpenAI-style message format: {role, content} — convert from Gemini's {role, parts} shape
    const messages = [
      { role: "system", content: systemInstruction },
      ...history.map(turn => ({
        role: turn.role === "model" ? "assistant" : "user",
        content: turn.parts.map(p => p.text).join(" ")
      }))
    ];

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "llama-3.3-70b-versatile",
        messages
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`
        }
      }
    );

    const text = response.data?.choices?.[0]?.message?.content;

    if (!text) {
      throw new Error("Groq returned no text");
    }

    return text;

  } catch (err) {
    console.error("Chat Groq error:", err.response?.data || err.message);
    throw err;
  }
}
async function generateInterviewQuestions(track, round, difficulty, prompt) {
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    { model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }] },
    { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` } }
  );
  const raw = response.data?.choices?.[0]?.message?.content;
  return JSON.parse(raw.replace(/```json|```/g, '').trim());
}

async function gradeInterviewAnswer(prompt) {
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    { model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: prompt }] },
    { headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` } }
  );
  const raw = response.data?.choices?.[0]?.message?.content;
  return JSON.parse(raw.replace(/```json|```/g, '').trim());
}
module.exports = { generateCareerQuiz, generateRecommendation, generateLearningPlan, chatReply, generateInterviewQuestions, gradeInterviewAnswer };