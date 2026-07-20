/* =========================================================
   CONFIG
   Frontend-only calls to Gemini, same pattern as interview.js.
   NOTE: hardcoding the key client-side is fine for the exam demo,
   but before any real/public launch this should move server-side
   (anyone can view it in page source right now).
   ========================================================= */


const el = (id) => document.getElementById(id);

/* =========================================================
   CORE GEMINI CALL
   history: [{ role: "user"|"model", parts: [{text}] }, ...]
   systemInstruction: plain string describing the persona/task
   Returns the raw text of the model's reply.
   ========================================================= */
async function askGemini(history, systemInstruction) {
  const response = await fetch("http://localhost:5000/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history, systemInstruction })
  });
  const data = await response.json();
  if (!data.reply) throw new Error("Empty Gemini response");
  return data.reply;
}

/* Ask Gemini for strict JSON and parse it, with one retry-on-parse-failure. */
async function askGeminiJSON(history, systemInstruction) {
  const raw = await askGemini(history, systemInstruction + "\n\nRespond with ONLY valid JSON, no markdown fences, no other text.");
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* =========================================================
   SPEECH: shared helpers (same mechanism as interview.js)
   ========================================================= */
const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechSupported = !!SpeechRecognitionAPI;

/* Only one utterance can ever be playing at a time (shared browser API),
   so we track the currently-playing button/indicator at module level.
   Clicking the SAME speaker button again — or sending a new message while
   one is still talking — stops it instead of stacking or restarting. */
let currentSpeakBtn = null;
let currentIndicatorEl = null;

function stopSpeaking() {
  window.speechSynthesis.cancel();
  if (currentSpeakBtn) currentSpeakBtn.textContent = "🔊 Listen";
  if (currentIndicatorEl) currentIndicatorEl.textContent = "";
  currentSpeakBtn = null;
  currentIndicatorEl = null;
}

/* Toggle: click a message's speaker button to play it; click the SAME
   button again while it's talking to stop it; click a different one to
   switch (stops the old one, starts the new one). */
function toggleSpeak(text, btn, indicatorEl) {
  if (!("speechSynthesis" in window)) return;
  const wasThisOnePlaying = currentSpeakBtn === btn && window.speechSynthesis.speaking;
  stopSpeaking();
  if (wasThisOnePlaying) return; // user just wanted it to stop

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  currentSpeakBtn = btn;
  currentIndicatorEl = indicatorEl;
  btn.textContent = "⏸ Stop";
  indicatorEl.textContent = "🔊 Speaking...";
  const reset = () => {
    if (currentSpeakBtn === btn) {
      btn.textContent = "🔊 Listen";
      indicatorEl.textContent = "";
      currentSpeakBtn = null;
      currentIndicatorEl = null;
    }
  };
  utterance.onend = reset;
  utterance.onerror = reset;
  window.speechSynthesis.speak(utterance);
}

/**
 * Wires a single mic button to toggle dictation into a textarea.
 * Mirrors the start/stop pattern from interview.js, collapsed into
 * one toggle button since chat UIs conventionally use a single mic icon.
 */
function attachVoiceInput(micBtn, textareaEl, indicatorEl, onListenStart) {
  if (!speechSupported) {
    micBtn.disabled = true;
    micBtn.title = "Voice input isn't supported in this browser";
    return;
  }

  const recognition = new SpeechRecognitionAPI();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  let listening = false;
  let manualStop = true;
  let baseText = "";

  recognition.onresult = (event) => {
    let finalChunk = "";
    let interimChunk = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalChunk += transcript + " ";
      else interimChunk += transcript;
    }
    if (finalChunk) baseText = (baseText + " " + finalChunk).trim() + " ";
    textareaEl.value = (baseText + interimChunk).trim();
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      indicatorEl.textContent = "⚠️ Microphone access was blocked.";
      manualStop = true;
      reset();
    }
  };

  recognition.onend = () => {
    if (!manualStop) {
      try { recognition.start(); } catch (e) { /* already running */ }
    } else {
      reset();
    }
  };

  function reset() {
    listening = false;
    micBtn.classList.remove("listening");
    micBtn.textContent = "🎤";
    indicatorEl.textContent = "";
  }

  micBtn.addEventListener("click", () => {
    if (!listening) {
      baseText = textareaEl.value ? textareaEl.value.trim() + " " : "";
      manualStop = false;
      listening = true;
      micBtn.classList.add("listening");
      micBtn.textContent = "⏹";
      indicatorEl.textContent = "🎤 Listening...";
      if (onListenStart) onListenStart();
      try { recognition.start(); } catch (e) { /* ignore double-start */ }
    } else {
      manualStop = true;
      recognition.stop();
    }
  });
}

/* =========================================================
   CHAT CONTROLLER FACTORY
   Builds a persistent, voice-enabled chat tutor bound to a
   given window/input/persona. Keeps its own history so the
   conversation has real memory across turns.
   ========================================================= */
/* Cycles a speaker-mode button through auto -> on -> off -> auto, and
   keeps its label in sync. "Auto" (the default) is the behavior you asked
   for: type to it and it replies in text only; talk to it and it talks
   back. "Always speak" / "Never speak" are the manual override so you're
   never stuck with whatever the default guesses. */
function setupSpeakerModeButton(btn) {
  const labels = { auto: "🔈 Auto (speaks back only if you spoke)", on: "🔊 Always speak replies", off: "🔇 Never speak replies" };
  const order = ["auto", "on", "off"];
  function render() { btn.textContent = labels[btn.dataset.mode]; }
  btn.addEventListener("click", () => {
    const next = order[(order.indexOf(btn.dataset.mode) + 1) % order.length];
    btn.dataset.mode = next;
    render();
    if (next === "off") stopSpeaking();
  });
  render();
}

function createChatController({ windowEl, inputEl, micBtn, sendBtn, indicatorEl, autoReadEl, systemInstruction, greeting }) {
  const history = [];
  setupSpeakerModeButton(autoReadEl);

  // Tracks how the CURRENT (not-yet-sent) message is being composed.
  // Set true the moment the mic starts listening; set back to false the
  // moment the user actually types/pastes into the box (a real "input"
  // event only fires for genuine user keystrokes — our own script writes
  // to textareaEl.value during dictation don't trigger it), so mixing
  // voice + manual edits correctly falls back to "text".
  let voiceComposedCurrentInput = false;

  attachVoiceInput(micBtn, inputEl, indicatorEl, () => { voiceComposedCurrentInput = true; });
  inputEl.addEventListener("input", () => { voiceComposedCurrentInput = false; });

  function renderMessage(role, text) {
    const row = document.createElement("div");
    row.className = `msg ${role === "user" ? "user" : "ai"}`;

    const bubbleWrap = document.createElement("div");
    bubbleWrap.className = "msg-row";

    const bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    bubble.innerHTML = escapeHtml(text).replace(/\n/g, "<br>");
    bubbleWrap.appendChild(bubble);

    let speakBtn = null;
    if (role !== "user") {
      const controls = document.createElement("div");
      controls.className = "msg-controls";
      speakBtn = document.createElement("button");
      speakBtn.className = "speak-btn";
      speakBtn.type = "button";
      speakBtn.textContent = "🔊 Listen";
      speakBtn.addEventListener("click", () => toggleSpeak(text, speakBtn, indicatorEl));
      controls.appendChild(speakBtn);
      bubbleWrap.appendChild(controls);
    }

    row.appendChild(bubbleWrap);
    windowEl.appendChild(row);
    windowEl.scrollTop = windowEl.scrollHeight;
    return { bubble, speakBtn };
  }

  function renderTyping() {
    const row = document.createElement("div");
    row.className = "msg ai typing";
    row.innerHTML = `<div class="msg-row"><div class="msg-bubble">thinking...</div></div>`;
    windowEl.appendChild(row);
    windowEl.scrollTop = windowEl.scrollHeight;
    return row;
  }

  async function send(overrideText) {
    const text = (overrideText !== undefined ? overrideText : inputEl.value).trim();
    if (!text) return;

    // Decide before we reset the flag: was THIS message spoken or typed?
    // autoReadEl now acts as a manual override ("always speak" / "never
    // speak"); its indeterminate/default state defers to how you sent it.
    const wasVoice = voiceComposedCurrentInput;
    voiceComposedCurrentInput = false;

    inputEl.value = "";
    inputEl.style.height = "auto";
    sendBtn.disabled = true;
    micBtn.disabled = true;
    stopSpeaking(); // sending a new message always interrupts any reply currently talking

    renderMessage("user", text);
    history.push({ role: "user", parts: [{ text }] });

    const typingRow = renderTyping();

    try {
      const reply = await askGemini(history, systemInstruction);
      history.push({ role: "model", parts: [{ text: reply }] });
      typingRow.remove();
      const aiMsg = renderMessage("ai", reply);

      const mode = autoReadEl.dataset.mode; // "auto" | "on" | "off"
      const shouldSpeak = mode === "on" || (mode === "auto" && wasVoice);
      if (shouldSpeak) toggleSpeak(reply, aiMsg.speakBtn, indicatorEl);
    } catch (err) {
      console.error("Chat error:", err);
      typingRow.remove();
      renderMessage("ai", "Sorry — I couldn't reach the AI service just now. Check your connection and try again.");
    } finally {
      sendBtn.disabled = false;
      if (speechSupported) micBtn.disabled = false;
    }
  }

  sendBtn.addEventListener("click", () => send());
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });
  inputEl.addEventListener("input", () => {
    inputEl.style.height = "auto";
    inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + "px";
  });

  // Seed the greeting as the opening AI turn (kept in history for context).
  renderMessage("ai", greeting);
  history.push({ role: "model", parts: [{ text: greeting }] });

  return { send, history };
}

/* =========================================================
   AI RECOMMENDATION — chat persona
   ========================================================= */
const recommendController = createChatController({
  windowEl: el("recommendChatWindow"),
  inputEl: el("recommendInput"),
  micBtn: el("recommendMicBtn"),
  sendBtn: el("recommendSendBtn"),
  indicatorEl: el("recommendSpeakingIndicator"),
  autoReadEl: el("recommendAutoRead"),
  systemInstruction: `You are Compass, a warm, sharp career advisor inside a student career-guidance app called CareerCompass.
You talk with students about their skills, interests, and goals, and help them figure out which tech career track fits them
(Frontend Developer, Backend Developer, Data Analyst / ML, or others they bring up) and what to do next.
Keep replies conversational and concise (roughly 3-6 sentences unless the student asks for depth). Ask a follow-up question
when it would help you give better advice. Be honest about trade-offs, not just encouraging. Never repeat the same generic
advice — build on what the student has already told you in this conversation.`,
  greeting: "Hey! I'm here to help you figure out where your skills point, and what to focus on next. Tell me a bit about what you enjoy working on, or what you're currently learning — or take the Career Quiz tab first and come back to talk it through."
});

/* =========================================================
   LEARNING HUB — tutor persona
   ========================================================= */
const learnController = createChatController({
  windowEl: el("learnChatWindow"),
  inputEl: el("learnInput"),
  micBtn: el("learnMicBtn"),
  sendBtn: el("learnSendBtn"),
  indicatorEl: el("learnSpeakingIndicator"),
  autoReadEl: el("learnAutoRead"),
  systemInstruction: `You are a patient, encouraging tech tutor inside a student career app, teaching one-on-one like a real
teacher rather than dumping a syntax reference. When a student asks about a topic: give a short, plain-language explanation
first, use a small concrete example, then ask a light check-for-understanding question or invite them to try something.
Adapt to what the student already seems to know from earlier in the conversation — don't restart from absolute basics if
they've shown they're past that. If they say "quiz me," ask one question at a time and give feedback before the next one.
Keep replies conversational and not too long (roughly 4-8 sentences) unless they ask for a deep dive.`,
  greeting: "I'm your Learning Hub tutor — pick a topic chip above or just ask me something like \"explain closures in JavaScript\" or \"quiz me on Python basics.\" I'll teach it like a conversation, not a manual."
});

el("learnTopicChips").addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  document.querySelectorAll("#learnTopicChips .chip").forEach(c => c.disabled = true);
  learnController.send(btn.dataset.topic).finally(() => {
    document.querySelectorAll("#learnTopicChips .chip").forEach(c => c.disabled = false);
  });
});

/* =========================================================
   TAB SWITCHING
   ========================================================= */
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => switchTab(btn.dataset.tab));
});

function switchTab(tab) {
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.add("hidden"));
  el(`tab-${tab}`).classList.remove("hidden");
}

/* =========================================================
   CAREER QUIZ
   ========================================================= */
const QUIZ_FALLBACK_QUESTIONS = [
  { text: "When starting a new project, what excites you most?", options: [
    "Making something look and feel right for the user",
    "Designing how data and logic flow behind the scenes",
    "Digging into a dataset to find a pattern no one noticed"
  ]},
  { text: "Pick the task you'd volunteer for first.", options: [
    "Polishing a page's layout and interactions",
    "Building the API that powers the app",
    "Building a model that predicts something useful"
  ]},
  { text: "Which kind of bug annoys you the least to hunt down?", options: [
    "A CSS layout glitch on one screen size",
    "A slow database query under load",
    "A model that's overfitting on training data"
  ]},
  { text: "What's most satisfying to you?", options: [
    "A smooth, intuitive user interface",
    "A system that scales cleanly as traffic grows",
    "A clear, well-supported insight from messy data"
  ]},
  { text: "Which subject would you rather go deeper on this month?", options: [
    "Modern frontend frameworks and UI patterns",
    "Databases, APIs, and system design",
    "Statistics, ML models, and data pipelines"
  ]},
  { text: "How do you prefer to measure success in your work?", options: [
    "Users find it easy and pleasant to use",
    "It's reliable, fast, and holds up under load",
    "It answers a question with evidence"
  ]}
];

let quizQuestions = [];
let quizAnswers = [];
let quizIndex = 0;

el("quizStartBtn").addEventListener("click", startQuiz);
el("retakeQuizBtn").addEventListener("click", () => {
  el("quizResultPanel").classList.add("hidden");
  el("quizIntro").classList.remove("hidden");
});

async function startQuiz() {
  const startBtn = el("quizStartBtn");
  startBtn.disabled = true;
  startBtn.textContent = "Preparing your questions...";

  try {
    quizQuestions = await askGeminiJSON(
      [{ role: "user", parts: [{ text: "Generate the quiz now." }] }],
      `You create a 6-question career-fit quiz for students exploring tech careers (tracks like Frontend Developer,
Backend Developer, Data Analyst / ML). Each question should be a short scenario about work style or interest, with
exactly 3 answer options, where each option leans toward one of the three tracks (in a consistent order: option 1 = frontend-leaning,
option 2 = backend-leaning, option 3 = data/ML-leaning). Return a JSON array of exactly 6 objects shaped like:
{"text": "<question>", "options": ["<frontend-leaning option>", "<backend-leaning option>", "<data/ml-leaning option>"]}`
    );
    if (!Array.isArray(quizQuestions) || quizQuestions.length === 0) throw new Error("bad quiz payload");
  } catch (err) {
    console.warn("Falling back to static quiz bank:", err);
    quizQuestions = QUIZ_FALLBACK_QUESTIONS;
  }

  startBtn.disabled = false;
  startBtn.textContent = "Start Quiz";

  quizAnswers = [];
  quizIndex = 0;

  el("quizIntro").classList.add("hidden");
  el("quizResultPanel").classList.add("hidden");
  el("quizQuestionPanel").classList.remove("hidden");

  loadQuizQuestion();
}

function loadQuizQuestion() {
  const q = quizQuestions[quizIndex];
  el("quizCounter").textContent = `Question ${quizIndex + 1} of ${quizQuestions.length}`;
  el("quizQuestionText").textContent = q.text;

  const optionsEl = el("quizOptions");
  optionsEl.innerHTML = "";
  q.options.forEach((optionText, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quiz-option-btn";
    btn.textContent = optionText;
    btn.addEventListener("click", () => selectQuizOption(i));
    optionsEl.appendChild(btn);
  });
}

function selectQuizOption(optionIndex) {
  quizAnswers.push({
    question: quizQuestions[quizIndex].text,
    answer: quizQuestions[quizIndex].options[optionIndex]
  });

  quizIndex++;
  if (quizIndex < quizQuestions.length) {
    loadQuizQuestion();
  } else {
    finishQuiz();
  }
}

async function finishQuiz() {
  el("quizQuestionPanel").classList.add("hidden");
  el("quizResultPanel").classList.remove("hidden");
  el("resultRole").textContent = "Analyzing your answers...";
  el("resultBlurb").textContent = "";
  el("resultConfidence").textContent = "";
  fillQuizList("resultStrengths", []);
  fillQuizList("resultGaps", []);

  const answerSummary = quizAnswers.map((a, i) => `Q${i + 1}: ${a.question}\nAnswer: ${a.answer}`).join("\n\n");

  try {
    const result = await askGeminiJSON(
      [{ role: "user", parts: [{ text: answerSummary }] }],
      `You are matching a student's career-quiz answers to the tech track they lean toward, among: Frontend Developer,
Backend Developer, Data Analyst / ML. Read their answers and respond with ONLY a JSON object shaped like:
{"role": "<matched track>", "confidence": "<e.g. Strong match / Moderate match>", "blurb": "<2-3 encouraging, specific sentences about why this fits them>",
"strengths": ["<2-4 short phrases about what their answers suggest they're naturally good at>"],
"gaps": ["<2-4 short, concrete skills or topics worth developing for this track>"]}`
    );
    renderQuizResult(result);
  } catch (err) {
    console.warn("Falling back to heuristic quiz scoring:", err);
    renderQuizResult(heuristicQuizResult());
  }
}

function heuristicQuizResult() {
  const tracks = ["Frontend Developer", "Backend Developer", "Data Analyst / ML"];
  const counts = [0, 0, 0];
  quizAnswers.forEach((a, i) => {
    const optionIndex = quizQuestions[i]?.options?.indexOf(a.answer);
    if (optionIndex !== undefined && optionIndex >= 0 && optionIndex < 3) counts[optionIndex]++;
  });
  const topIndex = counts.indexOf(Math.max(...counts));
  const role = tracks[topIndex];
  return {
    role,
    confidence: counts[topIndex] >= 4 ? "Strong match" : "Moderate match",
    blurb: `Your answers leaned most toward ${role} — that's where most of your instincts pointed across the quiz. Worth exploring further in the AI Recommendation chat.`,
    strengths: ["Consistent interest across several questions", "Clear preference over the alternatives"],
    gaps: ["Confirm this with a small hands-on project", "Talk it through in the AI Recommendation chat for specifics"]
  };
}

function renderQuizResult(result) {
  el("resultRole").textContent = result.role || "Not sure yet";
  el("resultConfidence").textContent = result.confidence || "";
  el("resultBlurb").textContent = result.blurb || "";
  fillQuizList("resultStrengths", result.strengths || []);
  fillQuizList("resultGaps", result.gaps || []);
  window.__lastQuizResult = result;
}

function fillQuizList(id, items) {
  const ul = el(id);
  ul.innerHTML = "";
  items.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    ul.appendChild(li);
  });
}

el("discussResultBtn").addEventListener("click", () => {
  const result = window.__lastQuizResult;
  switchTab("recommend");
  const seed = result
    ? `I just took the career quiz and matched to ${result.role} (${result.confidence}). It said my strengths point to: ${(result.strengths || []).join(", ")}. And that I should work on: ${(result.gaps || []).join(", ")}. Can you help me make sense of this and figure out what to actually do next?`
    : "I just took the career quiz — can you help me figure out what to do with the result?";
  recommendController.send(seed);
});