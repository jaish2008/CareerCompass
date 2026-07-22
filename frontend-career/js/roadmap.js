// ===========================
// Project Roadmap — dynamic renderer
// Reads `roadmapData` (roadmap-data.js) and builds every section.
// Edit roadmap-data.js to change page content — never edit the HTML.
// ===========================

document.addEventListener("DOMContentLoaded", async () => {

    // Existing project-timeline sections (from roadmap-data.js)
    if (typeof roadmapData !== "undefined") {
        renderScopeBanner(roadmapData.scope);
        renderStats(computeStats(roadmapData));
        renderTeam(roadmapData.team);
        renderTimeline(roadmapData.timeline);
        renderFutureScope(roadmapData.futureScope);
        initTimelineReveal();
        initStatCounters();
    }

    // Personalized career roadmap (from latest assessment)
    await loadPersonalizedRoadmap();

});


async function loadPersonalizedRoadmap() {
    const container = document.getElementById("personalized-roadmap-container");
    if (!container) return;

    try {
        const response = await fetch("http://127.0.0.1:5002/api/roadmap/latest");
        const data = await response.json();

        if (!data.has_assessment) {
            renderNoAssessmentCard(container);
            return;
        }

        renderPersonalizedRoadmap(container, data);

    } catch (error) {
        console.error(error);
        renderNoAssessmentCard(container);
    }
}


function renderNoAssessmentCard(container) {
    container.innerHTML = `
        <div class="no-assessment-card">
            <div class="no-assessment-icon">🧭</div>
            <h3>Personalized Roadmap Not Available</h3>
            <p>Complete your Career Assessment first so CareerCompass can generate a
               personalized learning roadmap based on your skills, strengths, and career goals.</p>
            <a href="assessment.html" class="take-assessment-btn">Take Career Assessment</a>
        </div>
    `;
}


function renderPersonalizedRoadmap(container, data) {
    const stepsHtml = data.roadmap_steps.map(step => `
        <div class="roadmap-step-card">
            <span class="roadmap-step-number">${escapeHtml(step.step_number)}</span>
            <h4>${escapeHtml(step.title)}</h4>
            <p>${escapeHtml(step.description)}</p>
        </div>
    `).join("");

    const suggestionsHtml = (data.suggestions || []).map(s => `<li>${escapeHtml(s)}</li>`).join("");

    container.innerHTML = `
        <div class="roadmap-summary-card">
            <div class="summary-item">
                <span class="summary-label">Domain</span>
                <span class="summary-value">${escapeHtml(data.recommended_domain)}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Status</span>
                <span class="summary-value">${escapeHtml(data.placement_status)}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Readiness</span>
                <span class="summary-value">${escapeHtml(data.placement_readiness)}%</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Confidence</span>
                <span class="summary-value">${escapeHtml(data.confidence_score)}%</span>
            </div>
        </div>

        <span class="suggestion-toggle" id="suggestion-toggle">💡 Show suggestions</span>
        <ul class="suggestion-list" id="suggestion-list">${suggestionsHtml}</ul>

        <div class="roadmap-steps-grid">
            ${stepsHtml}
        </div>
    `;

    const toggle = document.getElementById("suggestion-toggle");
    const list = document.getElementById("suggestion-list");
    toggle.addEventListener("click", () => {
        list.classList.toggle("open");
        toggle.textContent = list.classList.contains("open")
            ? "💡 Hide suggestions"
            : "💡 Show suggestions";
    });
}

// ---------------------------------------------------------
// Derive the 4 stat cards from the timeline + team, unless
// roadmapData.stats explicitly overrides them.
// ---------------------------------------------------------
function computeStats(data) {
  if (Array.isArray(data.stats) && data.stats.length) return data.stats;

  const timeline = data.timeline || [];
  const done = timeline.filter(t => t.status === "done").length;
  const active = timeline.filter(t => t.status === "active").length;
  const upcoming = timeline.filter(t => t.status === "upcoming").length;
  const total = timeline.length;
  const teamSize = (data.team || []).length;

  return [
    { label: "Modules Completed", value: `${done} / ${total}`, note: "On track" },
    { label: "In Progress", value: `${active}`, note: "Active this sprint" },
    { label: "Upcoming", value: `${upcoming}`, note: "Planned next" },
    { label: "Team Size", value: `${teamSize}`, note: data.team_size_note || "" }
  ];
}


// ---------------------------------------------------------
// Scope banner
// ---------------------------------------------------------
function renderScopeBanner(scope) {
  const el = document.getElementById("scope-banner");
  if (!scope || !el) return;

  const badgesHtml = (scope.badges || []).map(b => `
    <div class="scope-badge">
      <i class="${escapeAttr(b.icon)}"></i>
      <div>
        <strong>${escapeHtml(b.title)}</strong>
        <span>${escapeHtml(b.subtitle)}</span>
      </div>
    </div>
  `).join("");

  el.innerHTML = `
    <div class="scope-text">
      <span class="scope-eyebrow">${escapeHtml(scope.eyebrow)}</span>
      <h2>${escapeHtml(scope.heading)}</h2>
      <p>${escapeHtml(scope.description)}</p>
    </div>
    <div class="scope-badges">
      ${badgesHtml}
    </div>
  `;
}


// ---------------------------------------------------------
// Milestone stat cards
// ---------------------------------------------------------
function renderStats(stats) {
  const el = document.getElementById("stats");
  if (!el) return;

  el.innerHTML = stats.map(s => `
    <div class="stat-card">
      <h3>${escapeHtml(s.label)}</h3>
      <h2>${escapeHtml(s.value)}</h2>
      <p>${escapeHtml(s.note || "")}</p>
    </div>
  `).join("");
}


// ---------------------------------------------------------
// Team & ownership cards
// ---------------------------------------------------------
function renderTeam(team) {
  const el = document.getElementById("team-grid");
  if (!el || !Array.isArray(team)) return;

  el.innerHTML = team.map(member => `
    <div class="team-card">
      <div class="team-role-icon"><i class="${escapeAttr(member.icon)}"></i></div>
      <h3>${escapeHtml(member.name)}</h3>
      <p>${escapeHtml(member.description)}</p>
      <div class="team-tags">
        ${(member.tags || []).map(t => `<span>${escapeHtml(t)}</span>`).join("")}
      </div>
    </div>
  `).join("");
}


// ---------------------------------------------------------
// Timeline
// ---------------------------------------------------------
const STATUS_LABEL = { done: "Completed", active: "In Progress", upcoming: "Upcoming" };
const STATUS_ICON  = { done: "fa-solid fa-check", active: "fa-solid fa-spinner", upcoming: "fa-solid fa-ellipsis" };

function renderTimeline(timeline) {
  const el = document.getElementById("timeline");
  if (!el || !Array.isArray(timeline)) return;

  el.innerHTML = timeline.map(item => `
    <div class="timeline-item ${escapeAttr(item.status)}">
      <div class="timeline-node"><i class="${STATUS_ICON[item.status] || ""}"></i></div>
      <div class="timeline-card">
        <span class="timeline-status status-${escapeAttr(item.status)}">${STATUS_LABEL[item.status] || item.status}</span>
        <span class="timeline-phase">${escapeHtml(item.phase)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <div class="timeline-tags">
          ${(item.tags || []).map(t => `<span>${escapeHtml(t)}</span>`).join("")}
        </div>
      </div>
    </div>
  `).join("");
}


// ---------------------------------------------------------
// Future scope cards
// ---------------------------------------------------------
function renderFutureScope(items) {
  const el = document.getElementById("recommendation-grid");
  if (!el || !Array.isArray(items)) return;

  el.innerHTML = items.map(item => `
    <div class="recommendation-card">
      <h3>${item.emoji ? escapeHtml(item.emoji) + " " : ""}${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
    </div>
  `).join("");
}


// ---------------------------------------------------------
// Interactivity: reveal timeline items on scroll,
// animate stat numbers when they enter view.
// Runs AFTER rendering, since it needs the DOM to exist.
// ---------------------------------------------------------
function initTimelineReveal() {
  const timelineItems = document.querySelectorAll(".timeline-item");

  timelineItems.forEach(item => {
    item.style.opacity = "0";
    item.style.transform = "translateY(18px)";
    item.style.transition = "opacity .5s ease, transform .5s ease";
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  timelineItems.forEach(item => revealObserver.observe(item));
}

function initStatCounters() {
  const statValues = document.querySelectorAll(".stats .stat-card h2");

  const animateNumber = (el) => {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+)\s*\/\s*(\d+)$/) || raw.match(/^(\d+)$/);
    if (!match) return; // skip non-numeric values

    const hasFraction = match.length === 3;
    const target = parseInt(match[1], 10);
    const suffix = hasFraction ? ` / ${match[2]}` : "";
    let current = 0;
    const duration = 700;
    const stepTime = Math.max(Math.floor(duration / Math.max(target, 1)), 30);

    const timer = setInterval(() => {
      current++;
      el.textContent = `${current}${suffix}`;
      if (current >= target) clearInterval(timer);
    }, stepTime);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNumber(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statValues.forEach(el => statObserver.observe(el));
}


// ---------------------------------------------------------
// Tiny helpers to avoid HTML injection from data content
// ---------------------------------------------------------
function escapeHtml(str) {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, "&quot;");
}