/* =========================================================
   QUESTION BANK
   Each question carries "keywords": concepts a strong answer
   should touch on. These are used to actually check the
   content of the answer, not just its length.
   ========================================================= */
  const mlToInterviewTrack = {
    frontend: "Frontend Developer",
    backend: "Backend Developer",
    fullstack: "Full Stack Developer",
    aiml: "AI/ML Engineer"
    // devops and analyst have no exact matching option, so they're left out on purpose
};

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
  "Software Developer": [
    { text: "How would you decide between using an array and a linked list for a given problem?",
      keywords: ["array", "linked list", "access", "insertion", "deletion", "memory", "contiguous", "pointer"] },
    { text: "Explain the difference between object-oriented and functional programming.",
      keywords: ["object-oriented", "functional", "state", "immutability", "class", "pure function", "side effect", "encapsulation"] },
    { text: "What is Big O notation and why does it matter?",
      keywords: ["big o", "complexity", "time", "space", "scale", "growth", "worst case", "efficiency"] },
    { text: "How do you approach debugging a piece of code that's failing intermittently?",
      keywords: ["debug", "reproduce", "log", "race condition", "isolate", "test", "breakpoint", "intermittent"] },
    { text: "Explain the difference between unit testing and integration testing.",
      keywords: ["unit test", "integration test", "isolate", "mock", "dependency", "coverage", "end-to-end", "component"] }
  ],
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
  "Full Stack Developer": [
    { text: "How would you structure communication between a frontend and backend in a full-stack app?",
      keywords: ["api", "rest", "frontend", "backend", "request", "response", "json", "endpoint"] },
    { text: "Explain how you'd handle authentication across a full-stack application.",
      keywords: ["authentication", "token", "session", "jwt", "cookie", "login", "frontend", "backend"] },
    { text: "What's your approach to keeping frontend and backend validation in sync?",
      keywords: ["validation", "frontend", "backend", "duplicate", "schema", "consistency", "client", "server"] },
    { text: "How would you handle state that needs to be shared between multiple pages of a web app?",
      keywords: ["state", "global", "context", "store", "session", "local storage", "shared"] },
    { text: "Explain the tradeoffs between server-side rendering and client-side rendering.",
      keywords: ["server-side rendering", "client-side rendering", "seo", "performance", "hydration", "load time", "javascript"] }
  ],
  "Data Scientist": [
    { text: "Explain the difference between supervised and unsupervised learning.",
      keywords: ["supervised", "unsupervised", "label", "cluster", "prediction", "training data", "classification"] },
    { text: "How would you handle an imbalanced dataset in a classification problem?",
      keywords: ["imbalance", "oversample", "undersample", "smote", "weight", "class", "minority"] },
    { text: "What's the difference between correlation and causation, and why does it matter in analysis?",
      keywords: ["correlation", "causation", "confound", "relationship", "experiment", "bias"] },
    { text: "How would you explain a complex model's results to a non-technical stakeholder?",
      keywords: ["explain", "stakeholder", "simplify", "visualization", "interpret", "communicate", "non-technical"] },
    { text: "Explain the bias-variance tradeoff.",
      keywords: ["bias", "variance", "overfitting", "underfitting", "generalize", "complexity", "error"] }
  ],
  "AI/ML Engineer": [
    { text: "Explain the difference between training, validation, and test sets.",
      keywords: ["training", "validation", "test", "split", "overfit", "evaluate", "generalize"] },
    { text: "How would you decide when to fine-tune a pretrained model versus training from scratch?",
      keywords: ["fine-tune", "pretrained", "transfer learning", "scratch", "data", "compute", "cost"] },
    { text: "What's the purpose of regularization in machine learning models?",
      keywords: ["regularization", "overfitting", "l1", "l2", "penalty", "generalize", "dropout"] },
    { text: "Explain how gradient descent optimizes a model's parameters.",
      keywords: ["gradient descent", "learning rate", "loss", "minimize", "parameter", "weight", "optimize"] },
    { text: "How would you monitor a deployed ML model for performance degradation?",
      keywords: ["monitor", "drift", "degradation", "production", "metric", "alert", "retrain"] }
  ],
  "Cybersecurity": [
    { text: "Explain the difference between symmetric and asymmetric encryption.",
      keywords: ["symmetric", "asymmetric", "key", "encryption", "public key", "private key", "cipher"] },
    { text: "What is a man-in-the-middle attack, and how can it be prevented?",
      keywords: ["man-in-the-middle", "intercept", "encryption", "certificate", "tls", "prevent"] },
    { text: "Explain the principle of least privilege.",
      keywords: ["least privilege", "access", "permission", "minimal", "role", "restrict"] },
    { text: "How would you respond to discovering a data breach in progress?",
      keywords: ["breach", "respond", "contain", "incident", "investigate", "notify", "isolate"] },
    { text: "What's the difference between authentication and authorization in a security context?",
      keywords: ["authentication", "authorization", "identity", "permission", "access", "verify"] }
  ],
  "Cloud Engineering": [
    { text: "Explain the difference between horizontal and vertical scaling.",
      keywords: ["horizontal", "vertical", "scaling", "instance", "capacity", "load"] },
    { text: "What's the difference between IaaS, PaaS, and SaaS?",
      keywords: ["iaas", "paas", "saas", "infrastructure", "platform", "software", "service"] },
    { text: "How would you design a system for high availability across multiple regions?",
      keywords: ["high availability", "region", "failover", "redundancy", "replication", "disaster recovery"] },
    { text: "Explain the purpose of a load balancer in a cloud architecture.",
      keywords: ["load balancer", "distribute", "traffic", "availability", "scaling", "health check"] },
    { text: "How would you approach cost optimization for a cloud infrastructure?",
      keywords: ["cost", "optimize", "resource", "scaling", "reserved", "usage", "budget"] }
  ]
};


/* =========================================================
   AI CALLS
   Same backend endpoint the chat tabs use (/api/ai/chat).
   Used to generate fresh, current questions and to grade
   answers based on actual content — not just keyword matching.
   ========================================================= */
async function askAI(history, systemInstruction) {
  const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ history, systemInstruction })
  });
  const data = await response.json();
  if (!data.reply) throw new Error("Empty AI response");
  return data.reply;
}

async function askAIJSON(history, systemInstruction) {
  const raw = await askAI(history, systemInstruction + "\n\nRespond with ONLY valid JSON, no markdown fences, no other text.");
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

/* Generates 5 fresh interview questions for the chosen track/round/difficulty.
   Explicitly asked to favor current, still-relevant tools and skip anything
   outdated, so the question set evolves as the field does instead of being
   frozen at whatever was written into a static list. Falls back to the
   static bank below only if the AI call fails or returns something unusable,
   so the trainer still works offline or if the backend is briefly down. */
async function generateAIQuestions(track, round, difficulty) {
  const roundLabel = round === "HR"
    ? "HR / behavioral"
    : round === "Technical"
      ? "technical concepts"
      : "hands-on coding / problem-solving";
  const difficultyLine = round === "Coding" ? `Target difficulty: ${difficulty}.` : "";

  const systemInstruction = `You are generating mock interview questions for a student practicing for a ${track} role, ${roundLabel} round. ${difficultyLine}
Generate exactly 5 realistic interview questions this candidate could actually be asked today. Favor current, still-relevant tools, frameworks, and practices for ${track} right now, and skip anything outdated or deprecated unless it's still genuinely common in the field.
For each question, include a short list of 6-8 keywords or concepts a strong answer should touch on — these are used afterward to fairly grade the answer's actual content, not just its length.
Return ONLY a JSON array of exactly 5 objects shaped like:
{"text": "<question>", "keywords": ["<concept1>", "<concept2>", "..."]}`;

  return askAIJSON(
    [{ role: "user", parts: [{ text: "Generate the questions now." }] }],
    systemInstruction
  );
}

async function getDynamicQuestions(track, round, difficulty) {
  try {
    const questions = await generateAIQuestions(track, round, difficulty);
    if (Array.isArray(questions) && questions.length > 0) return questions;
    throw new Error("AI returned an empty or invalid question set");
  } catch (err) {
    console.warn("Falling back to static question bank:", err);
    return getQuestions(track, round, difficulty);
  }
}

const CODING_QUESTIONS = {
  "Software Developer": {
    Beginner: [
      { text: "Describe how you'd write a function to check if two strings are anagrams of each other.",
        keywords: ["anagram", "sort", "count", "character", "compare", "frequency", "string"] },
      { text: "How would you find the largest number in an array?",
        keywords: ["largest", "loop", "compare", "max", "array", "track"] },
      { text: "Describe how you'd implement a basic stack using an array.",
        keywords: ["stack", "push", "pop", "array", "lifo", "top"] },
      { text: "How would you write a function that counts vowels in a string?",
        keywords: ["vowel", "loop", "count", "string", "character", "condition"] },
      { text: "Explain how you'd check if a number is even or odd without using the modulo operator.",
        keywords: ["even", "odd", "bitwise", "divide", "remainder", "and operator"] }
    ],
    Intermediate: [
      { text: "Describe how you'd design a simple in-memory key-value cache with expiration.",
        keywords: ["cache", "key-value", "expire", "ttl", "map", "eviction", "timestamp"] },
      { text: "How would you implement a basic rate limiter for function calls?",
        keywords: ["rate limit", "throttle", "timestamp", "queue", "window", "token"] },
      { text: "Walk through how you'd detect balanced parentheses in an expression.",
        keywords: ["balanced", "parentheses", "stack", "push", "pop", "match", "bracket"] },
      { text: "How would you design a simple event emitter/pub-sub system?",
        keywords: ["event", "emitter", "subscribe", "publish", "listener", "callback", "pub-sub"] },
      { text: "Describe how you'd implement binary search on a sorted array.",
        keywords: ["binary search", "sorted", "midpoint", "divide", "log n", "pointer"] }
    ]
  },
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
  "Full Stack Developer": {
    Beginner: [
      { text: "Describe how you'd build a simple REST endpoint that returns a list of items.",
        keywords: ["rest", "endpoint", "get", "json", "route", "response", "list"] },
      { text: "How would you validate a form's email field before submitting it?",
        keywords: ["validate", "email", "regex", "form", "input", "client-side"] },
      { text: "Describe how you'd fetch data from an API and display it on a page.",
        keywords: ["fetch", "api", "async", "render", "display", "json", "loading"] },
      { text: "How would you write a simple function to paginate an array of results?",
        keywords: ["pagination", "array", "slice", "page", "limit", "offset"] },
      { text: "Explain how you'd store and retrieve a user's session after login.",
        keywords: ["session", "login", "cookie", "token", "store", "retrieve"] }
    ],
    Intermediate: [
      { text: "Describe how you'd design a full-stack feature for real-time notifications.",
        keywords: ["real-time", "websocket", "notification", "push", "subscribe", "backend", "frontend"] },
      { text: "How would you implement optimistic UI updates when saving data to a backend?",
        keywords: ["optimistic", "ui", "rollback", "update", "backend", "sync", "latency"] },
      { text: "Walk through how you'd design file upload handling across frontend and backend.",
        keywords: ["file upload", "multipart", "frontend", "backend", "storage", "validate", "size limit"] },
      { text: "How would you architect a full-stack app to support offline usage?",
        keywords: ["offline", "cache", "service worker", "sync", "local storage", "queue"] },
      { text: "Describe how you'd design role-based access control across the stack.",
        keywords: ["role", "access control", "permission", "authorization", "middleware", "frontend", "backend"] }
    ]
  },
  "Data Scientist": {
    Beginner: [
      { text: "How would you calculate the correlation between two columns in a dataset?",
        keywords: ["correlation", "columns", "dataset", "coefficient", "relationship", "pandas"] },
      { text: "Describe how you'd remove duplicate rows from a dataset.",
        keywords: ["duplicate", "rows", "dataset", "drop", "unique", "dataframe"] },
      { text: "How would you group data by a category and compute an average?",
        keywords: ["group by", "average", "category", "aggregate", "mean", "dataframe"] },
      { text: "Explain how you'd visualize the distribution of a numeric column.",
        keywords: ["distribution", "histogram", "visualize", "numeric", "plot", "column"] },
      { text: "How would you handle missing values in a small dataset?",
        keywords: ["missing", "null", "impute", "drop", "mean", "median"] }
    ],
    Intermediate: [
      { text: "Describe how you'd design a pipeline to clean and preprocess raw data for modeling.",
        keywords: ["pipeline", "clean", "preprocess", "feature", "raw data", "transform"] },
      { text: "How would you evaluate whether a regression model is a good fit?",
        keywords: ["regression", "r-squared", "residual", "error", "fit", "evaluate"] },
      { text: "Walk through how you'd detect outliers in a dataset.",
        keywords: ["outlier", "z-score", "iqr", "detect", "threshold", "distribution"] },
      { text: "How would you design an A/B test to measure a change in user behavior?",
        keywords: ["a/b test", "hypothesis", "control", "sample size", "significance", "metric"] },
      { text: "Describe how you'd build a simple recommendation system from user behavior data.",
        keywords: ["recommendation", "collaborative filtering", "behavior", "similarity", "rating", "user"] }
    ]
  },
  "AI/ML Engineer": {
    Beginner: [
      { text: "How would you split a dataset into training and test sets in code?",
        keywords: ["split", "training", "test", "dataset", "ratio", "random"] },
      { text: "Describe how you'd normalize a numeric feature before feeding it to a model.",
        keywords: ["normalize", "scale", "feature", "min-max", "standardize", "z-score"] },
      { text: "How would you implement a simple k-nearest-neighbors classifier conceptually?",
        keywords: ["k-nearest", "neighbors", "distance", "classify", "knn", "majority vote"] },
      { text: "Explain how you'd calculate accuracy for a classification model's predictions.",
        keywords: ["accuracy", "classification", "correct", "predictions", "evaluate", "metric"] },
      { text: "How would you one-hot encode a categorical feature?",
        keywords: ["one-hot", "encode", "categorical", "feature", "binary", "column"] }
    ],
    Intermediate: [
      { text: "Describe how you'd design a training pipeline that can resume after a crash.",
        keywords: ["pipeline", "checkpoint", "resume", "crash", "training", "save state"] },
      { text: "How would you implement early stopping during model training?",
        keywords: ["early stopping", "validation loss", "epoch", "patience", "overfitting", "training"] },
      { text: "Walk through how you'd batch and shard a large dataset for distributed training.",
        keywords: ["batch", "shard", "distributed", "training", "parallel", "dataset"] },
      { text: "How would you design an inference API that serves a trained model efficiently?",
        keywords: ["inference", "api", "serve", "latency", "model", "endpoint", "batch"] },
      { text: "Describe how you'd version and track experiments across many model runs.",
        keywords: ["versioning", "experiment tracking", "reproducibility", "metadata", "model", "runs"] }
    ]
  },
  "Cybersecurity": {
    Beginner: [
      { text: "How would you write a function to check if a password meets basic strength requirements?",
        keywords: ["password", "strength", "length", "character", "uppercase", "digit", "validate"] },
      { text: "Describe how you'd detect a simple SQL injection pattern in user input.",
        keywords: ["sql injection", "sanitize", "input", "escape", "query", "pattern"] },
      { text: "How would you hash a password before storing it?",
        keywords: ["hash", "password", "salt", "store", "encrypt", "bcrypt"] },
      { text: "Explain how you'd validate that a URL is safe before redirecting a user to it.",
        keywords: ["url", "validate", "redirect", "whitelist", "sanitize", "open redirect"] },
      { text: "How would you write a basic function to detect suspicious repeated login attempts?",
        keywords: ["login", "attempts", "rate limit", "lockout", "brute force", "threshold"] }
    ],
    Intermediate: [
      { text: "Describe how you'd design a system to detect and block brute-force login attempts.",
        keywords: ["brute force", "lockout", "rate limit", "ip", "threshold", "block"] },
      { text: "How would you implement token-based session expiration securely?",
        keywords: ["token", "expiration", "session", "refresh", "secure", "jwt"] },
      { text: "Walk through how you'd design a secure file upload system to prevent malicious files.",
        keywords: ["file upload", "malicious", "validate", "sanitize", "extension", "scan"] },
      { text: "How would you design logging so it doesn't leak sensitive information?",
        keywords: ["logging", "sensitive", "redact", "mask", "pii", "sanitize"] },
      { text: "Describe how you'd design a system for encrypting data at rest and in transit.",
        keywords: ["encryption", "at rest", "in transit", "tls", "key management", "data"] }
    ]
  },
  "Cloud Engineering": {
    Beginner: [
      { text: "Describe how you'd write a basic script to automate spinning up a cloud server.",
        keywords: ["script", "automate", "provision", "server", "cloud", "deploy"] },
      { text: "How would you check if a cloud storage bucket is publicly accessible?",
        keywords: ["bucket", "public", "access", "permission", "storage", "policy"] },
      { text: "Explain how you'd write a simple health-check endpoint for a service.",
        keywords: ["health check", "endpoint", "status", "monitor", "uptime", "response"] },
      { text: "How would you configure environment variables for an app running in the cloud?",
        keywords: ["environment variable", "config", "secret", "deploy", "cloud", "app"] },
      { text: "Describe how you'd write a basic script to back up a database to cloud storage.",
        keywords: ["backup", "database", "cloud storage", "script", "schedule", "automate"] }
    ],
    Intermediate: [
      { text: "Describe how you'd design auto-scaling rules for a web service under variable traffic.",
        keywords: ["auto-scaling", "traffic", "threshold", "instance", "metric", "capacity"] },
      { text: "How would you implement a CI/CD pipeline for deploying to the cloud automatically?",
        keywords: ["ci/cd", "pipeline", "deploy", "automate", "build", "test"] },
      { text: "Walk through how you'd design a multi-region failover strategy.",
        keywords: ["failover", "multi-region", "replication", "dns", "disaster recovery", "redundancy"] },
      { text: "How would you design infrastructure as code for a reproducible cloud environment?",
        keywords: ["infrastructure as code", "terraform", "reproducible", "template", "provision"] },
      { text: "Describe how you'd secure a cloud environment against unauthorized access.",
        keywords: ["secure", "unauthorized", "iam", "access control", "firewall", "policy"] }
    ]
  }
};

function getQuestions(track, round, difficulty) {
  if (round === "HR") return HR_QUESTIONS;
  if (round === "Technical") return TECHNICAL_QUESTIONS[track];
  return CODING_QUESTIONS[track][difficulty];
}

const API_BASE_URL =
  ["127.0.0.1", "localhost"].includes(window.location.hostname) &&
  window.location.port !== "5000"
    ? "http://127.0.0.1:5000"
    : window.location.origin;

let interviewReady = false;
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
startBtn.disabled = true;
startBtn.textContent = "Loading Interview Trainer...";

async function requestJSON(url, options = {}) {
  const response = await fetch(url, {
    credentials: "include",
    ...options
  });

  let result = {};

  try {
    result = await response.json();
  } catch (error) {
    throw new Error("The server returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(
      result.message || "The request could not be completed."
    );
  }

  return result;
}


async function loadInterviewHistory() {
  const result = await requestJSON(
    `${API_BASE_URL}/api/interview-attempts`
  );

  return Array.isArray(result.attempts)
    ? result.attempts
    : [];
}


async function saveInterviewAttempt(attemptData) {
  const result = await requestJSON(
    `${API_BASE_URL}/api/interview-attempts`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(attemptData)
    }
  );

  return result.attempt;
}


async function initializeInterviewTrainer() {
  try {
    const authResult = await requestJSON(
      `${API_BASE_URL}/api/me`
    );

    if (!authResult.authenticated || !authResult.user) {
      window.location.href = "login.html";
      return;
    }

    state.history = await loadInterviewHistory();

    interviewReady = true;
    startBtn.disabled = false;
    startBtn.textContent = "Start Interview";

    renderHistory();
    const mlResult = JSON.parse(localStorage.getItem("careerCompassMLPrediction") || "null");
    const mappedTrack = mlResult && mlToInterviewTrack[mlResult.key];
    if (mappedTrack) {
        careerSelect.value = mappedTrack;
    }
  } catch (error) {
    console.error(
      "Interview Trainer initialization failed:",
      error
    );

    startBtn.disabled = true;
    startBtn.textContent = "Interview Trainer Unavailable";

    const warning = document.createElement("div");
    warning.className = "interview-load-error";
    warning.textContent =
      "The Interview Trainer could not connect to the server.";

    setupPanel.prepend(warning);
  }
}

/* =========================================================
   SPEECH SYNTHESIS (reads the question aloud)
   ========================================================= */
function speakQuestion(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel(); // stop anything currently speaking

  if (recognition && state.listening) {
    manualStop = true;
    recognition.abort(); // abort (not stop) so it cuts off instantly and can't catch the TTS audio
  }

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

// Text already in the box before the CURRENT listening session began. Every
// onresult event rebuilds the session's transcript from scratch (rather than
// appending each "final" chunk on top of the last), because mobile browsers
// frequently re-fire the same growing phrase as "final" multiple times —
// appending each time caused runaway duplication like
// "get me get me about get me about get me about yourself...".
let sessionStartText = "";

if (SpeechRecognitionAPI) {
  recognition = new SpeechRecognitionAPI();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    let finalText = "";
    let interimText = "";
    for (let i = 0; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalText += transcript + " ";
      } else {
        interimText += transcript;
      }
    }
    state.baseAnswerText = (sessionStartText + " " + finalText).trim() + " ";
    answerBox.value = (state.baseAnswerText + interimText).trim();
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
      beginRecognitionSession();
    } else {
      resetVoiceButtons();
    }
  };
} else {
  voiceSupportHint.textContent = "Voice dictation isn't supported in this browser — you can still type your answers.";
}

// Starts (or restarts) a listening session, capturing whatever text is
// already in the box right now as the fixed starting point for this session.
function beginRecognitionSession() {
  sessionStartText = answerBox.value.trim();
  try { recognition.start(); } catch (e) { /* already running */ }
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

  // If the assistant is currently reading the question aloud, the user
  // starting to speak should interrupt it immediately, not talk over it.
  window.speechSynthesis.cancel();

  manualStop = false;
  state.listening = true;
  startVoiceBtn.disabled = true;
  startVoiceBtn.classList.add("active");
  stopVoiceBtn.disabled = false;
  speakingIndicator.textContent = "🎤 Listening...";
  beginRecognitionSession();
});

stopVoiceBtn.addEventListener("click", () => {
  if (!recognition) return;
  manualStop = true;
  recognition.abort(); // abort, not stop — cuts off instantly (important on mobile)
});

/* =========================================================
   INTERVIEW FLOW
   ========================================================= */
  startBtn.addEventListener("click", async () => {
      if (!interviewReady) {
    return;
  }

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
    recognition.abort();
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
    recognition.abort();
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
   Tries the AI backend first (accurate, reads the actual
   answer content). Falls back to a real trained ML scoring
   model if the API isn't reachable, so scoring always
   reflects what was actually said — not just length.
   ========================================================= */
async function gradeAnswer(question, answer) {
  if (!answer) {
    return {
      communication: 1,
      technical: 1,
      confidence: 1,
      score: 0,
      verdict: "weak",
      feedback:
        "No answer was given before time ran out. Try giving at least a partial answer next time.",
      missedKeywords: []
    };
  }

  try {
    return await aiGrade(question, answer);
  } catch (err) {
    console.warn("Falling back to ML scoring model:", err);
    return await heuristicGrade(question, answer);
  }
}

/* Has the AI actually read and judge the answer's content — catching things
   a fixed keyword list can't, like a correct answer phrased in unexpected
   terms, or a fluent-sounding answer that's actually wrong. Only falls back
   to the ML scoring model (below) if this call fails or returns something
   unusable. */
async function aiGrade(question, answer) {
  const systemInstruction = `You are grading a candidate's mock interview answer.
Question: "${question.text}"
Evaluate the answer honestly based on its actual content — relevance, accuracy, and clarity — not just its length or whether it uses expected buzzwords.
Return ONLY a JSON object shaped like:
{"communication": <integer 1-5>, "technical": <integer 1-5>, "confidence": <integer 1-5>, "score": <integer 0-100 overall>, "verdict": "<good|ok|weak>", "feedback": "<1-2 sentence specific, honest feedback>", "missedKeywords": ["<up to 2 short concepts they could have mentioned>"]}`;

  const result = await askAIJSON(
    [{ role: "user", parts: [{ text: answer }] }],
    systemInstruction
  );

  const score = Math.max(0, Math.min(100, Math.round(Number(result.score))));
  if (isNaN(score)) throw new Error("AI grading result missing a valid score");

  return {
    communication: clamp(result.communication),
    technical: clamp(result.technical),
    confidence: clamp(result.confidence),
    score,
    verdict: ["good", "ok", "weak"].includes(result.verdict) ? result.verdict : scoreToVerdict(score),
    feedback: typeof result.feedback === "string" && result.feedback.trim() ? result.feedback.trim() : "Solid effort — keep practicing.",
    missedKeywords: Array.isArray(result.missedKeywords) ? result.missedKeywords.slice(0, 2) : []
  };
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

/* ---- Offline / fallback grader (now backed by a real trained model) ----
   Actually checks the answer's content against the question's expected
   concepts, plus structure and hedging, exactly as before — but the FINAL
   score/verdict now comes from a trained RandomForestRegressor
   (interview_score_model.pkl) called via /score-answer, instead of a
   hand-written weighted formula. If that call fails too (e.g. Flask itself
   is down), it falls back one more level to the original formula so the
   trainer still works completely offline. */
async function heuristicGrade(question, answer) {
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
  const structureScore = Math.min(1, (structureHits + (hasNumbers ? 1 : 0)) / 2);

  // --- Hedging / low-confidence language (light touch — a little hedging is normal) ---
  const hedgeWords = ["i'm not sure", "i am not sure", "i guess", "i don't know", "no idea", "not confident"];
  const hedgeHits = hedgeWords.filter(h => lowerAnswer.includes(h)).length;

  // --- Length signal (a floor, not the main driver) — saturates quickly ---
  const lengthScore = Math.min(1, wordCount / 35);
  const wordCountNorm = Math.min(1, wordCount / 100);

  // Empty or near-empty answers still score honestly low, no model call needed.
  if (wordCount < 4) {
    return {
      communication: 1, technical: 1, confidence: 1, score: 5,
      verdict: "weak",
      feedback: "That's too short to evaluate — try giving at least a full sentence or two.",
      missedKeywords: keywords.slice(0, 3)
    };
  }

  // --- Real trained ML model call ---
  let score, verdict;
  try {
    const response = await fetch(`${API_BASE_URL}/score-answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        features: {
          coverage: coverage,
          length_score: lengthScore,
          structure_score: structureScore,
          hedge_count: hedgeHits,
          word_count_norm: wordCountNorm
        }
      })
    });
    console.log("score-answer response status:", response.status);
    if (!response.ok) throw new Error("score-answer request failed");
    const result = await response.json();
    score = result.score;
    verdict = result.verdict;
    console.log("✅ ML SCORING MODEL USED — score:", score, "verdict:", verdict);
  } catch (err) {
    console.warn("ML scoring unavailable, using formula fallback:", err);
    const baseline = 0.40;
    const overall = Math.max(0.05, Math.min(1,
      baseline + coverage * 0.32 + lengthScore * 0.18 + structureScore * 0.10 - (hedgeHits * 0.05)
    ));
    score = Math.round(overall * 100);
    verdict = scoreToVerdict(score);
  }

  const technical = clamp(1 + (0.40 + coverage * 0.6) * 4);
  const communication = clamp(1 + (0.40 + Math.min(1, (structureHits / 2) + lengthScore * 0.6)) * 4 / 1.4);
  const confidence = clamp(1 + Math.max(0, (0.40 + 0.6 - hedgeHits * 0.2)) * 4);

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
async function finishInterview() {
  window.speechSynthesis.cancel();
  questionPanel.classList.add("hidden");
  reportPanel.classList.remove("hidden");
  sumProgress.textContent = `${state.questions.length} / ${state.questions.length}`;

  const n = state.results.length;
  const avg = (key) => state.results.reduce((sum, r) => sum + r[key], 0) / n;

  const comm = avg("communication");
  const tech = avg("technical");
  const conf = avg("confidence");
  const readinessScore = Math.round(state.results.reduce((sum, r) => sum + r.score, 0) / n);

  el("starComm").textContent = starString(comm);
  el("starTech").textContent = starString(tech);
  el("starConf").textContent = starString(conf);
  el("hireProb").textContent = `${readinessScore}%`;

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

  const attemptPayload = {
  track: state.track,
  round: state.round,
  difficulty: state.difficulty,
  readinessScore,
  communication: Number(comm.toFixed(2)),
  technical: Number(tech.toFixed(2)),
  confidence: Number(conf.toFixed(2)),
  strengths,
  improvements
};

try {
  const savedAttempt = await saveInterviewAttempt(
    attemptPayload
  );

  state.history.unshift(savedAttempt);
} catch (error) {
  console.error(
    "Interview attempt database save failed:",
    error
  );

  // Keep the current result visible even if saving fails.
  state.history.unshift({
    ...attemptPayload,
    date: new Date().toISOString()
  });
}

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
  historyList.replaceChildren();

  if (state.history.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "history-empty";
    emptyMessage.textContent =
      "No completed interview attempts yet.";

    historyList.appendChild(emptyMessage);
    return;
  }

  state.history.slice(0, 20).forEach((attempt) => {
    const row = document.createElement("div");
    row.className = "history-row";

    const details = document.createElement("span");

    let formattedDate = "Unknown date";

    if (attempt.date) {
      const parsedDate = new Date(attempt.date);

      if (!Number.isNaN(parsedDate.getTime())) {
        formattedDate = parsedDate.toLocaleDateString();
      }
    }

    details.textContent =
      `${formattedDate} · ${attempt.track} (${attempt.round})`;

    const score = document.createElement("strong");
    score.textContent =
      `${Number(attempt.readinessScore) || 0}%`;

    row.append(details, score);
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

initializeInterviewTrainer();