/* ============================================================
   CareerCompass — Learning Planner (v2)
   ------------------------------------------------------------
   New in this version:
   - Notification Center (overdue / due today / streak-at-risk)
   - XP + Level gamification (replaces plain streak-only view)
   - Focus Timer (Pomodoro-style) per task
   - "Today Only" view toggle
   Storage keys: careerCompassPlanner, careerCompassStreak, careerCompassXP
   ============================================================ */

const API_BASE_URL = "http://127.0.0.1:5000";

let STORAGE_KEY = "";
let STREAK_KEY = "";
let XP_KEY = "";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const XP_PER_LEVEL = 100;
const XP_VALUE = { High: 15, Medium: 10, Low: 5 };
const FOCUS_BONUS_XP = 5;

let tasks = [];
let plannerReady = false;
let currentView = "week";
let focusTaskId = null;
let focusMinutes = 25;
let focusInterval = null;

// today's real weekday, mapped to our Monday-first DAYS array
const jsDay = new Date().getDay(); // 0 = Sunday
const todayName = DAYS[(jsDay + 6) % 7];

// ---- DOM ----
const taskForm = document.getElementById("taskForm");
const dayBoard = document.getElementById("dayBoard");
const bellBtn = document.getElementById("bellBtn");
const notifPanel = document.getElementById("notifPanel");

function readStoredJSON(key, fallbackValue) {
  try {
    const storedValue = localStorage.getItem(key);

    if (!storedValue) {
      return fallbackValue;
    }

    return JSON.parse(storedValue);
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    return fallbackValue;
  }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };

    return entities[character];
  });
}

async function initializePlanner() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/me`, {
      method: "GET",
      credentials: "include"
    });

    const result = await response.json();

    if (!response.ok || !result.authenticated || !result.user) {
      window.location.href = "login.html";
      return;
    }

    const userId = result.user.id;

    STORAGE_KEY = `careerCompassPlanner:${userId}`;
    STREAK_KEY = `careerCompassStreak:${userId}`;
    XP_KEY = `careerCompassXP:${userId}`;

    tasks = readStoredJSON(STORAGE_KEY, []);

    if (!Array.isArray(tasks)) {
      tasks = [];
    }

    document.getElementById("taskDay").value = todayName;

    plannerReady = true;
    renderAll();
  } catch (error) {
    console.error("Planner authentication failed:", error);
    window.location.href = "login.html";
  }
}


// ============================================================
// GREETING + TODAY SUMMARY
// ============================================================
function renderHero() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  document.getElementById("greeting").textContent = `${greeting}. Let's move today forward.`;

  const todayTasks = tasks.filter(t => t.day === todayName);
  const todayDone = todayTasks.filter(t => t.done).length;
  document.getElementById("todaySummary").textContent = todayTasks.length
    ? `${todayName}: ${todayDone} of ${todayTasks.length} tasks done`
    : `${todayName}: no tasks planned yet — add one below`;
}

// ============================================================
// TASK CRUD
// ============================================================
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

   if (!plannerReady) {
    return;
  }
  const title = document.getElementById("taskTitle").value.trim();
  if (!title) return;

  tasks.push({
    id: Date.now(),
    title,
    category: document.getElementById("taskCategory").value,
    day: document.getElementById("taskDay").value,
    priority: document.getElementById("taskPriority").value,
    done: false
  });

  saveTasks();
  taskForm.reset();
  document.getElementById("taskPriority").value = "Medium";
  renderAll();
});

dayBoard.addEventListener("click", (e) => {
  const cardEl = e.target.closest("[data-id]");
  if (!cardEl) return;
  const id = Number(cardEl.dataset.id);

  if (e.target.matches(".task-check")) toggleTask(id);
  if (e.target.matches(".task-delete")) deleteTask(id);
  if (e.target.matches(".focus-btn")) openFocusModal(id);
});

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  const wasDone = task.done;
  task.done = !task.done;

  if (task.done && !wasDone) {
    awardXP(XP_VALUE[task.priority] || 5);
    registerStreakDay();
  }
  saveTasks();
  renderAll();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderAll();
}

function saveTasks() {
  if (!plannerReady || !STORAGE_KEY) {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ============================================================
// DAY BOARD RENDER
// ============================================================
document.getElementById("viewWeekBtn").addEventListener("click", () => setView("week"));
document.getElementById("viewTodayBtn").addEventListener("click", () => setView("today"));

function setView(view) {
  currentView = view;
  document.getElementById("viewWeekBtn").classList.toggle("active", view === "week");
  document.getElementById("viewTodayBtn").classList.toggle("active", view === "today");
  renderBoard();
}

function renderBoard() {
  const daysToShow = currentView === "today" ? [todayName] : DAYS;

  dayBoard.innerHTML = daysToShow.map(day => {
    const dayTasks = tasks.filter(t => t.day === day);
    const isToday = day === todayName;
    return `
      <div class="day-column ${isToday ? "is-today" : ""}">
        <div class="day-column-title">
          <span>${day}${isToday ? " · Today" : ""}</span>
          <span class="day-count">${dayTasks.filter(t=>t.done).length}/${dayTasks.length}</span>
        </div>
        ${dayTasks.length ? dayTasks.map(taskCard).join("") : `<p class="day-empty">No tasks</p>`}
      </div>
    `;
  }).join("");
}

function taskCard(task) {
  const safePriority = ["High", "Medium", "Low"].includes(task.priority)
    ? task.priority
    : "Medium";

  const safeTitle = escapeHTML(task.title);
  const safeCategory = escapeHTML(task.category);
  const safeId = Number(task.id);

  return `
    <div class="task-card ${task.done ? "done" : ""}" data-id="${safeId}">
      <div class="task-top-row">
        <input
          type="checkbox"
          class="task-check"
          aria-label="Mark task as complete"
          ${task.done ? "checked" : ""}
        >

        <span class="task-title">${safeTitle}</span>

        <button
          type="button"
          class="task-delete"
          title="Delete task"
          aria-label="Delete task"
        >
          ✕
        </button>
      </div>

      <div class="task-meta">
        <span class="task-category">${safeCategory}</span>

        <span class="priority-pill priority-${safePriority.toLowerCase()}">
          <span class="priority-dot"></span>
          ${safePriority}
        </span>
      </div>

      ${
        !task.done
          ? `<button type="button" class="focus-btn">▶ Start Focus Session</button>`
          : ""
      }
    </div>
  `;
}

// ============================================================
// WEEKLY PROGRESS + CATEGORY BREAKDOWN
// ============================================================
function renderProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  document.getElementById("progressPercent").textContent = `${percent}%`;
  document.getElementById("progressLabel").textContent = `${done} of ${total} tasks done`;

  const ring = document.getElementById("ringFill");
  const circ = 2 * Math.PI * 52;
  ring.style.strokeDasharray = circ;
  ring.style.strokeDashoffset = circ - (percent / 100) * circ;
}

function renderCategoryBreakdown() {
  const box = document.getElementById("categoryBreakdown");
  if (!tasks.length) { box.innerHTML = `<p class="hint">No tasks yet.</p>`; return; }

  const counts = {};
  tasks.forEach(t => {
    counts[t.category] = counts[t.category] || { total: 0, done: 0 };
    counts[t.category].total++;
    if (t.done) counts[t.category].done++;
  });

  box.innerHTML = Object.entries(counts).map(([cat, c]) => `
    <div class="category-row">
  <span>${escapeHTML(cat)}</span>
  <strong>${c.done}/${c.total}</strong>
</div>
  `).join("");
}

// ============================================================
// XP + LEVEL SYSTEM
// ============================================================
function loadXP() {
  return JSON.parse(localStorage.getItem(XP_KEY) || '{"xp":0}');
}
function awardXP(amount) {
  const data = loadXP();
  data.xp += amount;
  localStorage.setItem(XP_KEY, JSON.stringify(data));
}
function renderXP() {
  const data = loadXP();
  const level = Math.floor(data.xp / XP_PER_LEVEL) + 1;
  const progress = data.xp % XP_PER_LEVEL;
  const percent = (progress / XP_PER_LEVEL) * 100;

  document.getElementById("levelNum").textContent = level;
  document.getElementById("xpFill").style.width = `${percent}%`;
  document.getElementById("xpLabel").textContent = `${progress} / ${XP_PER_LEVEL} XP to next level`;

  const ring = document.getElementById("levelRingFill");
  const circ = 2 * Math.PI * 34;
  ring.style.strokeDasharray = circ;
  ring.style.strokeDashoffset = circ - (percent / 100) * circ;
}

// ============================================================
// STREAK
// ============================================================
function registerStreakDay() {
  const today = new Date().toDateString();
  const data = JSON.parse(localStorage.getItem(STREAK_KEY) || '{"count":0,"lastDate":null}');
  if (data.lastDate === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  data.count = (data.lastDate === yesterday.toDateString()) ? data.count + 1 : 1;
  data.lastDate = today;
  localStorage.setItem(STREAK_KEY, JSON.stringify(data));
}
function renderStreak() {
  const data = JSON.parse(localStorage.getItem(STREAK_KEY) || '{"count":0,"lastDate":null}');
  document.getElementById("streakNumber").textContent = data.count;
}

// ============================================================
// NOTIFICATION CENTER
// ============================================================
function buildNotifications() {
  const todayIndex = DAYS.indexOf(todayName);
  const notifs = [];

  tasks.forEach(t => {
    if (t.done) return;
    const taskIndex = DAYS.indexOf(t.day);
    if (taskIndex < todayIndex) {
      notifs.push({ type: "overdue", text: `Overdue: "${t.title}" was due ${t.day}` });
    } else if (taskIndex === todayIndex) {
      notifs.push({ type: "today", text: `Due today: "${t.title}"` });
    }
  });

  // streak-at-risk: evening, nothing completed today yet
  const hour = new Date().getHours();
  const doneToday = tasks.some(t => t.day === todayName && t.done);
  if (hour >= 18 && !doneToday && tasks.some(t => t.day === todayName)) {
    notifs.push({ type: "streak", text: "Your streak is at risk — complete a task today to keep it alive." });
  }

  return notifs;
}

function renderNotifications() {
  const notifs = buildNotifications();
  const badge = document.getElementById("bellBadge");
  const list = document.getElementById("notifList");

  if (notifs.length) {
    badge.textContent = notifs.length;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }

  list.innerHTML = notifs.length
   ? notifs
    .map(
      (notification) =>
        `<div class="notif-item ${notification.type}">
          ${escapeHTML(notification.text)}
        </div>`
    )
    .join("")
    : `<p class="notif-empty">You're all caught up 🎉</p>`;
}

bellBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  notifPanel.classList.toggle("hidden");
});
document.addEventListener("click", (e) => {
  if (!notifPanel.contains(e.target) && e.target !== bellBtn) {
    notifPanel.classList.add("hidden");
  }
});

// ============================================================
// FOCUS TIMER (Pomodoro-style, per task)
// ============================================================
const focusModal = document.getElementById("focusModal");
const focusTimerDisplay = document.getElementById("focusTimerDisplay");
const timerOptions = document.getElementById("timerOptions");

function openFocusModal(taskId) {
  focusTaskId = taskId;
  const task = tasks.find(t => t.id === taskId);
  document.getElementById("focusTaskTitle").textContent = task.title;
  focusMinutes = 25;
  setTimerDisplay(focusMinutes * 60);
  focusModal.classList.remove("hidden");
}

timerOptions.addEventListener("click", (e) => {
  if (!e.target.matches("button")) return;
  [...timerOptions.children].forEach(b => b.classList.remove("active"));
  e.target.classList.add("active");
  focusMinutes = Number(e.target.dataset.min);
  setTimerDisplay(focusMinutes * 60);
});

function setTimerDisplay(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  focusTimerDisplay.textContent = `${m}:${s}`;
}

document.getElementById("startFocusBtn").addEventListener("click", () => {
  let secondsLeft = focusMinutes * 60;
  document.getElementById("startFocusBtn").textContent = "Running…";
  document.getElementById("startFocusBtn").disabled = true;

  clearInterval(focusInterval);
  focusInterval = setInterval(() => {
    secondsLeft--;
    setTimerDisplay(Math.max(secondsLeft, 0));
    if (secondsLeft <= 0) {
      clearInterval(focusInterval);
      completeFocusSession();
    }
  }, 1000);
});

document.getElementById("cancelFocusBtn").addEventListener("click", closeFocusModal);

function completeFocusSession() {
  const task = tasks.find(t => t.id === focusTaskId);
  if (task && !task.done) {
    task.done = true;
    awardXP((XP_VALUE[task.priority] || 5) + FOCUS_BONUS_XP);
    registerStreakDay();
    saveTasks();
  }
  focusTimerDisplay.textContent = "Done! 🎉";
  setTimeout(() => { closeFocusModal(); renderAll(); }, 1200);
}

function closeFocusModal() {
  clearInterval(focusInterval);
  focusModal.classList.add("hidden");
  const btn = document.getElementById("startFocusBtn");
  btn.textContent = "Start Focus";
  btn.disabled = false;
}

// ============================================================
// RENDER ALL
// ============================================================
function renderAll() {
  renderHero();
  renderBoard();
  renderProgress();
  renderCategoryBreakdown();
  renderXP();
  renderStreak();
  renderNotifications();
}

initializePlanner();