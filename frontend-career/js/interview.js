/* =========================================================
   QUESTION BANK
   Each question carries "keywords": concepts a strong answer
   should touch on. These are used to actually check the
   content of the answer, not just its length.
   ========================================================= */
   const HR_QUESTIONS = [
  { text: "Tell me about yourself and why you're interested in this role.",
    keywords: ["experience", "background", "skills", "role", "interested", "passion", "goal", "team"] },
  { text: "Describe a time you faced a conflict with a teammate. How did you resolve it?",
    keywords: ["conflict", "disagreement", "listen", "communicate", "resolve", "compromise", "team", "outcome"] },
  { text: "Where do you see yourself professionally in the next few years?",
    keywords: ["growth", "learn", "career", "goal", "years", "develop", "skills", "role"] },
  { text: "Tell me about a project you're proud of and what made it successful.",
    keywords: ["project", "proud", "challenge", "result", "team", "impact", "learned", "success"] },
  { text: "How do you handle tight deadlines or shifting priorities?",
    keywords: ["prioritize", "deadline", "plan", "communicate", "manage", "organize", "stress", "focus"] }
];

const TECHNICAL_QUESTIONS = {
  "Frontend Developer": [
    { text: "Explain the difference between the virtual DOM and the real DOM.",
      keywords: ["virtual dom", "real dom", "diff", "reconciliation", "render", "performance", "update", "batch"] },
    { text: "How would you optimize the performance of a page with a long scrollable list?",
      keywords: ["virtualization", "windowing", "lazy load", "pagination", "render", "reflow", "memo", "debounce"] },
    { text: "What's the difference between CSS Grid and Flexbox, and when would you use each?",
      keywords: ["grid", "flexbox", "two-dimensional", "one-dimensional", "layout", "rows", "columns", "axis"] },
    { text: "Explain how the browser's event loop handles asynchronous JavaScript.",
      keywords: ["event loop", "call stack", "queue", "microtask", "macrotask", "async", "promise", "callback"] },
    { text: "How would you make a web app accessible for users relying on screen readers?",
      keywords: ["accessibility", "aria", "semantic", "screen reader", "alt text", "keyboard", "focus", "contrast"] }
  ],
  "Backend Developer": [
    { text: "Explain the difference between SQL and NoSQL databases and when you'd choose each.",
      keywords: ["sql", "nosql", "schema", "relational", "scale", "consistency", "structured", "document"] },
    { text: "How would you design a rate limiter for a public API?",
      keywords: ["rate limit", "token bucket", "throttle", "sliding window", "quota", "abuse", "429", "cache"] },
    { text: "What is the purpose of database indexing, and what are the tradeoffs?",
      keywords: ["index", "lookup", "query speed", "write cost", "b-tree", "storage", "performance", "table"] },
    { text: "Explain the difference between authentication and authorization.",
      keywords: ["authentication", "authorization", "identity", "permission", "login", "token", "role", "access"] },
    { text: "How would you handle a service that needs to scale to 10x its current traffic overnight?",
      keywords: ["scale", "load balancer", "horizontal", "cache", "queue", "autoscale", "bottleneck", "database"] }
  ],
  "Data Analyst / ML": [
    { text: "Explain the bias-variance tradeoff in machine learning.",
      keywords: ["bias", "variance", "overfitting", "underfitting", "generalize", "complexity", "error", "model"] },
    { text: "How would you handle missing data in a dataset before training a model?",
      keywords: ["missing data", "imputation", "drop", "mean", "median", "null", "impute", "outlier"] },
    { text: "What's the difference between precision and recall, and when does each matter more?",
      keywords: ["precision", "recall", "false positive", "false negative", "trade-off", "f1", "threshold", "class"] },
    { text: "Explain how you'd evaluate whether a model is overfitting.",
      keywords: ["overfitting", "validation", "train", "test", "cross-validation", "gap", "regularization", "curve"] },
    { text: "Walk through how you'd approach an A/B test for a new product feature.",
      keywords: ["a/b test", "hypothesis", "control", "sample size", "significance", "metric", "randomize", "variant"] }
  ]
};


async function getDynamicQuestions(track, round, difficulty) {
  const staticFallback = getQuestions(track, round, difficulty); // your existing bank, used if Gemini fails

  const prompt = `You are creating mock interview questions for a ${difficulty} ${track} candidate, ${round} round.
Generate 5 questions that are CURRENTLY common in real interviews today, favoring the latest stable tools/frameworks
in this field over outdated ones. For each question, also list 6-8 concept keywords a strong answer should touch on.

Respond with ONLY a JSON array, no other text, in this exact shape:
[{"text": "<question>", "keywords": ["<keyword>", "..."]}, ...]`;

  try {
   const response = await fetch("http://localhost:5000/api/ai/interview-questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, track, round, difficulty })
    });
    if (!response.ok) throw new Error("Request failed");
    const data = await response.json();
    const parsed = data.questions;
    if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Empty question list");
    return parsed;
  } catch (err) {
    console.warn("Falling back to static question bank:", err);
    return staticFallback;
  }
}

const CODING_QUESTIONS = {
  "Frontend Developer": {
    Beginner: [
      { text: "Describe how you'd write a function that reverses a string.",
        keywords: ["reverse", "loop", "split", "array", "index", "swap", "string"] },
      { text: "How would you remove duplicate values from an array?",
        keywords: ["duplicate", "set", "unique", "filter", "loop", "array", "hash"] },
      { text: "Explain how you'd debounce a search input, in plain terms.",
        keywords: ["debounce", "delay", "timeout", "wait", "input", "settimeout", "clear"] },
      { text: "How would you check if a string is a palindrome?",
        keywords: ["palindrome", "reverse", "compare", "loop", "pointer", "string"] },
      { text: "Describe how you'd sum all the numbers in an array.",
        keywords: ["sum", "loop", "reduce", "accumulator", "array", "total"] }
    ],
    Intermediate: [
      { text: "Describe how you'd design a function that flattens a deeply nested array.",
        keywords: ["flatten", "recursion", "nested", "array", "stack", "depth"] },
      { text: "How would you implement a simple state management system from scratch?",
        keywords: ["state", "subscribe", "listener", "store", "update", "immutable", "publish"] },
      { text: "Walk through how you'd build a debounced infinite-scroll loader.",
        keywords: ["scroll", "debounce", "observer", "threshold", "fetch", "pagination", "throttle"] },
      { text: "How would you implement a basic LRU cache in JavaScript?",
        keywords: ["lru", "cache", "map", "evict", "capacity", "recently used", "hashmap"] },
      { text: "Describe how you'd detect and remove a cycle in a linked list.",
        keywords: ["cycle", "linked list", "fast", "slow", "pointer", "floyd", "loop"] }
    ]
  },
  "Backend Developer": {
    Beginner: [
      { text: "How would you write a function to check if a number is prime?",
        keywords: ["prime", "divisor", "loop", "modulo", "square root", "factor"] },
      { text: "Describe how you'd merge two sorted arrays into one sorted array.",
        keywords: ["merge", "sorted", "pointer", "compare", "array", "two-pointer"] },
      { text: "How would you count the frequency of words in a string?",
        keywords: ["frequency", "hashmap", "count", "split", "word", "dictionary"] },
      { text: "Explain how you'd reverse a linked list.",
        keywords: ["linked list", "reverse", "pointer", "next", "node", "iterative"] },
      { text: "How would you find the first non-repeating character in a string?",
        keywords: ["non-repeating", "character", "hashmap", "count", "order", "string"] }
    ],
    Intermediate: [
      { text: "Describe how you'd design a URL-shortening service at a high level.",
        keywords: ["hash", "encode", "database", "collision", "redirect", "unique id", "cache"] },
      { text: "How would you implement pagination for an API returning millions of rows?",
        keywords: ["pagination", "cursor", "offset", "limit", "index", "performance", "page"] },
      { text: "Walk through how you'd design an idempotent payment API endpoint.",
        keywords: ["idempotent", "payment", "unique key", "retry", "duplicate", "transaction"] },
      { text: "How would you detect and handle a deadlock in a multi-threaded service?",
        keywords: ["deadlock", "lock", "thread", "timeout", "ordering", "resource", "contention"] },
      { text: "Describe how you'd design a job queue with retries and backoff.",
        keywords: ["queue", "retry", "backoff", "worker", "dead letter", "exponential", "job"] }
    ]
  },
  "Data Analyst / ML": {
    Beginner: [
      { text: "How would you calculate the mean, median, and mode of a dataset?",
        keywords: ["mean", "median", "mode", "average", "sort", "frequency", "sum"] },
      { text: "Describe how you'd write a query to find duplicate rows in a table.",
        keywords: ["duplicate", "group by", "having", "count", "sql", "distinct"] },
      { text: "How would you normalize a numeric feature before training a model?",
        keywords: ["normalize", "scale", "min-max", "standardize", "z-score", "feature"] },
      { text: "Explain how you'd handle a dataset with class imbalance.",
        keywords: ["imbalance", "oversample", "undersample", "smote", "weight", "class"] },
      { text: "How would you compute a rolling average over a time series?",
        keywords: ["rolling", "window", "average", "time series", "moving", "smooth"] }
    ],
    Intermediate: [
      { text: "Describe how you'd design a feature pipeline for a recommendation model.",
        keywords: ["feature", "pipeline", "recommendation", "embedding", "batch", "real-time"] },
      { text: "How would you detect data drift in a production ML model?",
        keywords: ["drift", "distribution", "monitor", "baseline", "statistical", "alert"] },
      { text: "Walk through how you'd design an experiment to test a new ranking algorithm.",
        keywords: ["experiment", "ranking", "metric", "control", "hypothesis", "significance"] },
      { text: "How would you optimize a slow SQL query joining several large tables?",
        keywords: ["index", "join", "query plan", "optimize", "explain", "partition"] },
      { text: "Describe how you'd build a pipeline to deduplicate near-identical records.",
        keywords: ["dedupe", "fuzzy match", "similarity", "hash", "pipeline", "record"] }
    ]
  }
};

function getQuestions(track, round, difficulty) {
  if (round === "HR") return HR_QUESTIONS;
  if (round === "Technical") return TECHNICAL_QUESTIONS[track] || HR_QUESTIONS;
  return (CODING_QUESTIONS[track] && CODING_QUESTIONS[track][difficulty]) || HR_QUESTIONS;
}

/* =========================================================
   STATE
   ========================================================= */
const state = {
  track: null,
  round: null,
  difficulty: null,
  questions: [],
  currentIndex: 0,
  results: [],      // per-question grading results
  history: [],       // session history of completed interviews
  timerId: null,
  timeLeft: 90,
  listening: false,
  baseAnswerText: "" // text already in the box before the current voice session started
};

/* =========================================================
   DOM REFS
   ========================================================= */
const el = (id) => document.getElementById(id);
const setupPanel = el("setupPanel");
const questionPanel = el("questionPanel");
const reportPanel = el("reportPanel");

const careerSelect = el("careerSelect");
const roundSelect = el("roundSelect");
const difficultySelect = el("difficultySelect");
const startBtn = el("startBtn");
const voiceSupportHint = el("voiceSupportHint");

const qCounter = el("qCounter");
const timerEl = el("timer");
const questionText = el("questionText");
const speakingIndicator = el("speakingIndicator");
const answerBox = el("answerBox");
const startVoiceBtn = el("startVoiceBtn");
const stopVoiceBtn = el("stopVoiceBtn");
const submitAnswerBtn = el("submitAnswerBtn");
const answerFeedback = el("answerFeedback");

const sumCareer = el("sumCareer");
const sumRound = el("sumRound");
const sumProgress = el("sumProgress");
const historyList = el("historyList");

/* =========================================================
   SPEECH SYNTHESIS (reads the question aloud)
   ========================================================= */
function speakQuestion(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel(); // stop anything currently speaking
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.onstart = () => { speakingIndicator.textContent = "🔊 Reading question aloud..."; };
  utterance.onend = () => { speakingIndicator.textContent = ""; };
  window.speechSynthesis.speak(utterance);
}

/* =========================================================
   SPEECH RECOGNITION (dictates into the answer box)
   ========================================================= */
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let manualStop = true; // true = user has not asked to listen / has asked to stop

if (SpeechRecognitionAPI) {
  recognition = new SpeechRecognitionAPI();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    let finalChunk = "";
    let interimChunk = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalChunk += transcript + " ";
      } else {
        interimChunk += transcript;
      }
    }
    if (finalChunk) {
      state.baseAnswerText = (state.baseAnswerText + " " + finalChunk).trim() + " ";
    }
    answerBox.value = (state.baseAnswerText + interimChunk).trim();
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      speakingIndicator.textContent = "⚠️ Microphone access was blocked.";
      manualStop = true;
      resetVoiceButtons();
    }
  };

  // The browser can end a recognition session on its own (e.g. after a pause).
  // Only restart automatically if the user has NOT pressed "Stop".
  recognition.onend = () => {
    if (!manualStop) {
      try { recognition.start(); } catch (e) { /* already running */ }
    } else {
      resetVoiceButtons();
    }
  };
} else {
  voiceSupportHint.textContent = "Voice dictation isn't supported in this browser — you can still type your answers.";
}

function resetVoiceButtons() {
  state.listening = false;
  startVoiceBtn.disabled = false;
  startVoiceBtn.classList.remove("active");
  stopVoiceBtn.disabled = true;
  speakingIndicator.textContent = "";
}

startVoiceBtn.addEventListener("click", () => {
  if (!recognition || state.listening) return;
  state.baseAnswerText = answerBox.value ? answerBox.value.trim() + " " : "";
  manualStop = false;
  state.listening = true;
  startVoiceBtn.disabled = true;
  startVoiceBtn.classList.add("active");
  stopVoiceBtn.disabled = false;
  speakingIndicator.textContent = "🎤 Listening...";
  try { recognition.start(); } catch (e) { /* ignore double-start errors */ }
});

stopVoiceBtn.addEventListener("click", () => {
  if (!recognition) return;
  manualStop = true;
  recognition.stop(); // onend will call resetVoiceButtons()
});

/* =========================================================
   INTERVIEW FLOW
   ========================================================= */
  startBtn.addEventListener("click", async () => {
  state.track = careerSelect.value;
  state.round = roundSelect.value;
  state.difficulty = difficultySelect.value;
  startBtn.disabled = true;
  startBtn.textContent = "Generating fresh questions...";
  state.questions = await getDynamicQuestions(state.track, state.round, state.difficulty);
  startBtn.disabled = false;
  startBtn.textContent = "Start Interview";
  state.currentIndex = 0;
  state.results = [];

  sumCareer.textContent = state.track;
  sumRound.textContent = state.round;

  setupPanel.classList.add("hidden");
  reportPanel.classList.add("hidden");
  questionPanel.classList.remove("hidden");

  loadQuestion();
});

function loadQuestion() {
  const total = state.questions.length;
  qCounter.textContent = `Question ${state.currentIndex + 1} of ${total}`;
  sumProgress.textContent = `${state.currentIndex} / ${total}`;

  const q = state.questions[state.currentIndex];
  questionText.textContent = q.text;
  answerBox.value = "";
  state.baseAnswerText = "";
  answerFeedback.classList.add("hidden");
  answerFeedback.className = "feedback-box hidden";
  submitAnswerBtn.disabled = false;

  // make sure any in-progress dictation from the previous question is stopped
  if (recognition && state.listening) {
    manualStop = true;
    recognition.stop();
  }

  speakQuestion(q.text);
  startTimer();
}

function startTimer() {
  clearInterval(state.timerId);
  state.timeLeft = 90;
  updateTimerDisplay();
  state.timerId = setInterval(() => {
    state.timeLeft--;
    updateTimerDisplay();
    if (state.timeLeft <= 0) {
      clearInterval(state.timerId);
      submitAnswer(); // auto-submit whatever has been typed/dictated
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(state.timeLeft / 60).toString().padStart(2, "0");
  const s = (state.timeLeft % 60).toString().padStart(2, "0");
  timerEl.textContent = `${m}:${s}`;
  timerEl.classList.toggle("timer-warning", state.timeLeft <= 15);
}

submitAnswerBtn.addEventListener("click", submitAnswer);

async function submitAnswer() {
  clearInterval(state.timerId);
  if (recognition && state.listening) {
    manualStop = true;
    recognition.stop();
  }
  submitAnswerBtn.disabled = true;

  const question = state.questions[state.currentIndex];
  const answer = answerBox.value.trim();

  answerFeedback.classList.remove("hidden");
  answerFeedback.className = "feedback-box";
  answerFeedback.innerHTML = "<p>Evaluating your answer...</p>";

  const grade = await gradeAnswer(question, answer);
  state.results.push(grade);

  answerFeedback.className = `feedback-box ${grade.verdict}`;
  const verdictLabel = grade.verdict === "good" ? "Strong answer" : grade.verdict === "ok" ? "Solid, room to grow" : "Needs work";
  const pct = (v) => Math.round((v / 5) * 100);
  answerFeedback.innerHTML =
    `<strong>${grade.score}% overall — ${verdictLabel}</strong>` +
    `<p class="score-breakdown">Communication: ${pct(grade.communication)}% &nbsp;·&nbsp; Answer content: ${pct(grade.technical)}% &nbsp;·&nbsp; Confidence: ${pct(grade.confidence)}%</p>` +
    `<p>${escapeHtml(grade.feedback)}</p>` +
    (grade.missedKeywords && grade.missedKeywords.length
      ? `<p>You could also mention: ${grade.missedKeywords.map(escapeHtml).join(", ")}.</p>`
      : "");

  setTimeout(() => {
    state.currentIndex++;
    if (state.currentIndex < state.questions.length) {
      loadQuestion();
    } else {
      finishInterview();
    }
  }, 2200);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* =========================================================
   GRADING
   Tries the Claude API first (accurate, reads the actual
   answer content). Falls back to a keyword/structure-based
   heuristic grader if the API isn't reachable, so scoring
   always reflects what was actually said — not just length.
   ========================================================= */
async function gradeAnswer(question, answer) {
  if (!answer) {
    return {
      communication: 1, technical: 1, confidence: 1, score: 0,
      verdict: "weak",
      feedback: "No answer was given before time ran out. Try to get at least a partial answer down next time.",
      missedKeywords: []
    };
  }

  try {
    const prompt = `You are a supportive but honest interview coach grading a mock ${state.round} interview answer for a ${state.difficulty} ${state.track} candidate.

Question: "${question.text}"
Candidate's answer: "${answer}"
Concepts a strong answer would likely touch on: ${question.keywords.join(", ")}

Read the answer for its actual meaning, not for exact keyword matches — a candidate who explains a concept correctly in their own words or with synonyms should score just as well as one who uses the exact listed terms. This was likely spoken and transcribed, so ignore minor grammar, filler words, or transcription artifacts. Score 1-5 on communication (clarity/structure), technical (accuracy/relevance of content — for HR questions, judge relevance and self-awareness instead), and confidence (decisiveness of the answer, not hedging). A reasonable, mostly-correct answer should land around 3-4 on each; reserve 1-2 for answers that are truly off-topic, empty, or substantively wrong. List up to 3 concepts from the list above that the answer genuinely failed to address, if any — do not list a concept the candidate already covered in different words. Write one short, specific, encouraging-but-honest feedback sentence that references what the candidate actually said.

Respond with ONLY a JSON object, no other text, in this exact shape:
{"communication": <1-5>, "technical": <1-5>, "confidence": <1-5>, "verdict": "<good|ok|weak>", "feedback": "<one sentence>", "missedKeywords": ["<concept>", "..."]}`;

const response = await fetch("http://localhost:5000/api/ai/grade-answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    if (!response.ok) throw new Error("API request failed");
    const parsed = await response.json();

    const communication = clamp(parsed.communication);
    const technical = clamp(parsed.technical);
    const confidence = clamp(parsed.confidence);
    const score = Math.round(((communication + technical + confidence) / 15) * 100);

    return {
      communication, technical, confidence, score,
      verdict: ["good", "ok", "weak"].includes(parsed.verdict) ? parsed.verdict : scoreToVerdict(score),
      feedback: parsed.feedback || "Answer recorded.",
      missedKeywords: Array.isArray(parsed.missedKeywords) ? parsed.missedKeywords.slice(0, 3) : []
    };
  } catch (err) {
    console.warn("Falling back to keyword-based grading:", err);
    return heuristicGrade(question, answer);
  }
}

function clamp(n) {
  n = Number(n);
  if (isNaN(n)) return 3;
  return Math.min(5, Math.max(1, Math.round(n)));
}

function scoreToVerdict(score) {
  if (score >= 75) return "good";
  if (score >= 45) return "ok";
  return "weak";
}

/* ---- Offline fallback grader ----
   Actually checks the answer's content against the question's
   expected concepts, plus structure and hedging. This grader
   is intentionally generous: it uses fuzzy, word-level matching
   (so paraphrasing counts, not just exact keyword phrases),
   starts from a fair baseline, and only marks an answer down
   hard when it's genuinely empty, off-topic, or very short. */
function heuristicGrade(question, answer) {
  const lowerAnswer = answer.toLowerCase();
  const words = lowerAnswer.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const STOPWORDS = new Set(["a","an","the","of","to","and","or","in","on","for","with","your","you","is","are","how","would","what","design","explain","describe","walk","through"]);

  // --- Content relevance: fuzzy match — a keyword phrase counts as touched
  // on if ANY of its meaningful words appears anywhere in the answer. ---
  const keywords = question.keywords || [];
  const keywordHit = (phrase) => {
    const parts = phrase.toLowerCase().split(/\s+/).filter(w => w.length > 2 && !STOPWORDS.has(w));
    if (parts.length === 0) return lowerAnswer.includes(phrase.toLowerCase());
    return parts.some(w => lowerAnswer.includes(w));
  };
  const mentioned = keywords.filter(keywordHit);
  const missedKeywords = keywords.filter(k => !mentioned.includes(k));
  const coverage = keywords.length ? mentioned.length / keywords.length : 0.6;

  // --- Structure/specificity bonus: examples, numbers, STAR-style language ---
  const structureSignals = ["for example", "such as", "e.g.", "specifically", "in my experience",
    "situation", "task", "action", "result", "led to", "because", "which meant", "instance"];
  const structureHits = structureSignals.filter(s => lowerAnswer.includes(s)).length;
  const hasNumbers = /\d/.test(answer);

  // --- Hedging / low-confidence language (light touch — a little hedging is normal) ---
  const hedgeWords = ["i'm not sure", "i am not sure", "i guess", "i don't know", "no idea", "not confident"];
  const hedgeHits = hedgeWords.filter(h => lowerAnswer.includes(h)).length;

  // --- Length signal (a floor, not the main driver) — saturates quickly ---
  const lengthScore = Math.min(1, wordCount / 35);

  // Empty or near-empty answers still score honestly low.
  if (wordCount < 4) {
    return {
      communication: 1, technical: 1, confidence: 1, score: 5,
      verdict: "weak",
      feedback: "That's too short to evaluate — try giving at least a full sentence or two.",
      missedKeywords: keywords.slice(0, 3)
    };
  }

  // Generous weighted overall (0-1), starting from a fair baseline so a
  // reasonable, on-topic answer lands comfortably in the 60-85% range.
  const baseline = 0.40;
  const overall = baseline
    + coverage * 0.32
    + lengthScore * 0.18
    + Math.min(1, (structureHits + (hasNumbers ? 1 : 0)) / 2) * 0.10
    - (hedgeHits * 0.05);

  const clampedOverall = Math.max(0.05, Math.min(1, overall));
  const score = Math.round(clampedOverall * 100);

  const technical = clamp(1 + (baseline + coverage * 0.6) * 4);
  const communication = clamp(1 + (baseline + Math.min(1, (structureHits / 2) + lengthScore * 0.6)) * 4 / 1.4);
  const confidence = clamp(1 + Math.max(0, (baseline + 0.6 - hedgeHits * 0.2)) * 4);

  const verdict = scoreToVerdict(score);

  let feedback;
  if (coverage === 0 && keywords.length) {
    feedback = "This doesn't clearly touch on the concepts the question is looking for — try naming the specific approach or terms you'd use.";
  } else if (coverage < 0.3) {
    feedback = "You're on the right track, but try covering a couple more of the key ideas this question expects.";
  } else if (hedgeHits > 0) {
    feedback = "The content is reasonable — stating your points a bit more directly would boost your confidence score.";
  } else if (structureHits === 0 && wordCount < 30) {
    feedback = "Good core idea — adding a concrete example would make this even stronger.";
  } else {
    feedback = "Solid, relevant answer with clear reasoning.";
  }

  return { communication, technical, confidence, score, verdict, feedback, missedKeywords: missedKeywords.slice(0, 2) };
}

/* =========================================================
   FINAL REPORT
   ========================================================= */
function finishInterview() {
  window.speechSynthesis.cancel();
  questionPanel.classList.add("hidden");
  reportPanel.classList.remove("hidden");
  sumProgress.textContent = `${state.questions.length} / ${state.questions.length}`;

  const n = state.results.length;
  const avg = (key) => state.results.reduce((sum, r) => sum + r[key], 0) / n;

  const comm = avg("communication");
  const tech = avg("technical");
  const conf = avg("confidence");
  const hireProbability = Math.round(state.results.reduce((sum, r) => sum + r.score, 0) / n);

  el("starComm").textContent = starString(comm);
  el("starTech").textContent = starString(tech);
  el("starConf").textContent = starString(conf);
  el("hireProb").textContent = `${hireProbability}%`;

  const strengths = [];
  const improvements = [];
  if (comm >= 4) strengths.push("Clear, well-structured communication.");
  if (tech >= 4) strengths.push("Strong grasp of the subject matter.");
  if (conf >= 4) strengths.push("Confident, decisive delivery.");
  if (comm < 3) improvements.push("Work on structuring answers more clearly (try situation → action → result).");
  if (tech < 3) improvements.push("Review core concepts for this track before your next attempt.");
  if (conf < 3) improvements.push("Practice speaking answers aloud to build confidence under time pressure.");

  const weakest = state.results.filter(r => r.verdict === "weak");
  weakest.slice(0, 2).forEach(r => improvements.push(r.feedback));
  const strongest = state.results.filter(r => r.verdict === "good");
  strongest.slice(0, 2).forEach(r => strengths.push(r.feedback));

  const allMissed = [...new Set(state.results.flatMap(r => r.missedKeywords || []))];
  if (allMissed.length) improvements.push(`Recurring gaps across your answers: ${allMissed.slice(0, 5).join(", ")}.`);

  if (strengths.length === 0) strengths.push("You completed the full interview — that consistency is a great base to build on.");
  if (improvements.length === 0) improvements.push("Keep practicing to stay sharp under interview conditions.");

  fillList("strengthsList", strengths);
  fillList("improveList", improvements);

  state.history.push({
    track: state.track,
    round: state.round,
    difficulty: state.difficulty,
    hireProbability,
    date: new Date().toLocaleDateString()
  });
  renderHistory();
}

function starString(avg) {
  const full = Math.round(avg);
  return "★".repeat(full) + "☆".repeat(5 - full);
}

function fillList(id, items) {
  const ul = el(id);
  ul.innerHTML = "";
  items.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    ul.appendChild(li);
  });
}

function renderHistory() {
  if (state.history.length === 0) return;
  historyList.innerHTML = "";
  state.history.slice().reverse().forEach(attempt => {
    const row = document.createElement("div");
    row.className = "history-row";
    row.innerHTML = `<span>${attempt.date} · ${attempt.track} (${attempt.round})</span><strong>${attempt.hireProbability}%</strong>`;
    historyList.appendChild(row);
  });
}

/* =========================================================
   RETRY
   ========================================================= */
el("retryBtn").addEventListener("click", () => {
  reportPanel.classList.add("hidden");
  setupPanel.classList.remove("hidden");
});