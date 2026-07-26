"use strict";

const API_BASE_URL =
  ["127.0.0.1", "localhost"].includes(window.location.hostname) &&
  window.location.port !== "5000"
    ? "http://127.0.0.1:5000"
    : window.location.origin;

const PLANNER_DAYS = [
    "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday", "Sunday"
];

const PLANNER_DAY_LABELS = [
    "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
];

const PRIORITY_WEIGHT = { High: 3, Medium: 2, Low: 1 };

let weeklyProgressChart = null;


/* =====================================================
   LOAD AUTHENTICATED USER
   ===================================================== */

async function loadDashboardUser() {

    const greeting =
        document.getElementById("dashboardGreeting");

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/me`,
            {
                method: "GET",
                credentials: "include"
            }
        );


        if (response.status === 401) {

            window.location.replace("login.html");
            return;
        }


        const data = await response.json();


if (
    !response.ok ||
    data.authenticated !== true ||
    !data.user
) {

    window.location.replace("login.html");
    return;
}


        const fullName =
            String(data.user.name || "Student").trim();

        const firstName =
            fullName.split(/\s+/)[0];


        if (greeting) {

            greeting.textContent =
                `Welcome Back, ${firstName} 👋`;
        }


        document.title =
            `${firstName}'s Dashboard | CareerCompass`;

    } catch (error) {

        console.error(
            "Dashboard authentication error:",
            error
        );


        if (greeting) {

            greeting.textContent =
                "Unable to load your account";
        }
    }
}


loadDashboardUser();


/* =====================================================
   STATS CARDS (Placement Readiness, Resume, GitHub)
   ===================================================== */

function renderStatsCards(dashboardData) {

    const statCards = document.querySelectorAll(".stats .stat-card");

    if (dashboardData.placementReadiness !== null && dashboardData.placementReadiness !== undefined) {
        const el = statCards[0]?.querySelector("h2");
        if (el) el.textContent = dashboardData.placementReadiness + "%";
    }

    if (dashboardData.resumeScore !== null && dashboardData.resumeScore !== undefined) {
        const el = statCards[1]?.querySelector("h2");
        if (el) el.textContent = Math.round(dashboardData.resumeScore) + "%";
    }

    if (dashboardData.githubScore !== null && dashboardData.githubScore !== undefined) {
        const el = statCards[2]?.querySelector("h2");
        if (el) el.textContent = Math.round(dashboardData.githubScore) + "%";
    }
}


/* =====================================================
   SKILL PROGRESS (from Roadmap data)
   ===================================================== */

function renderSkillProgress(dashboardData) {

    const summary = dashboardData.roadmapProgress?.summary;

    const label = document.getElementById("skillProgressCareerLabel");
    const skillsBar = document.getElementById("skillsProgressBar");
    const stagesBar = document.getElementById("stagesProgressBar");
    const projectsBar = document.getElementById("projectsProgressBar");
    const overallBar = document.getElementById("overallProgressBarDash");

    if (!summary) {
        if (label) {
            label.textContent = "Select a career on your Skill Roadmap to see progress here.";
        }
        return;
    }

    if (label) {
        label.textContent = `${summary.careerName || "Your career"} — ${summary.percentage || 0}% complete`;
    }

    if (skillsBar) skillsBar.value = summary.skillsPercentage || 0;
    if (stagesBar) stagesBar.value = summary.stagesPercentage || 0;
    if (projectsBar) projectsBar.value = summary.projectsPercentage || 0;
    if (overallBar) overallBar.value = summary.percentage || 0;
}


/* =====================================================
   RECENT ACTIVITY (built from real saved data)
   ===================================================== */

function renderRecentActivity(dashboardData, plannerTasks) {

    const list = document.getElementById("recentActivityList");

    if (!list) {
        return;
    }

    const items = [];

    if (dashboardData.resumeScore !== null && dashboardData.resumeScore !== undefined) {
        items.push(`✅ Resume Analyzed — ${Math.round(dashboardData.resumeScore)}% ATS score`);
    }

    if (dashboardData.githubScore !== null && dashboardData.githubScore !== undefined) {
        items.push(`✅ GitHub Profile Synced — ${Math.round(dashboardData.githubScore)}% health`);
    }

    const roadmapSummary = dashboardData.roadmapProgress?.summary;

    if (roadmapSummary && roadmapSummary.percentage > 0) {
        items.push(`✅ Roadmap Progress — ${roadmapSummary.careerName || "Career"} at ${roadmapSummary.percentage}%`);
    }

    if (dashboardData.careerResult) {
        items.push(`✅ Career Assessment Completed`);
    }

    const completedTaskCount = plannerTasks.filter(task => task.done).length;

    if (completedTaskCount > 0) {
        items.push(`✅ ${completedTaskCount} Planner Task${completedTaskCount === 1 ? "" : "s"} Completed`);
    }

    if (items.length === 0) {
        list.innerHTML = `<li class="activity-empty">No activity yet — analyze your resume or GitHub profile to get started.</li>`;
        return;
    }

    list.innerHTML = items.map(item => `<li>${item}</li>`).join("");
}


/* =====================================================
   PLANNER-BASED SECTIONS
   (Upcoming Deadlines, Upcoming Goals, Weekly Progress)
   ===================================================== */

function getTodayPlannerIndex() {
    const jsDay = new Date().getDay(); // 0 = Sunday
    return (jsDay + 6) % 7; // 0 = Monday, matching PLANNER_DAYS
}

function buildDeadlineCard(task, daysAway) {

    let dueLabel;
    let urgencyClass;

    if (daysAway === 0) {
        dueLabel = "Due Today";
        urgencyClass = "urgent";
    } else if (daysAway === 1) {
        dueLabel = "Due Tomorrow";
        urgencyClass = "urgent";
    } else if (daysAway <= 3) {
        dueLabel = `Due ${task.day}`;
        urgencyClass = "medium";
    } else {
        dueLabel = `Due ${task.day}`;
        urgencyClass = "normal";
    }

    const daysLeftLabel =
        daysAway === 0
            ? "Today"
            : daysAway === 1
                ? "1 Day Left"
                : `${daysAway} Days Left`;

    const safeTitle = String(task.title || "Untitled task")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    const safeCategory = String(task.category || "General")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    return `
        <div class="deadline-card">

            <h3>${safeTitle}</h3>

            <p>${safeCategory} — ${dueLabel}</p>

            <span class="deadline ${urgencyClass}">${daysLeftLabel}</span>

        </div>
    `;
}

function getUpcomingTasks(tasks) {

    const todayIndex = getTodayPlannerIndex();

    return tasks
        .filter(task => !task.done)
        .map(task => {
            const taskIndex = PLANNER_DAYS.indexOf(task.day);
            const safeIndex = taskIndex === -1 ? todayIndex : taskIndex;
            const daysAway = (safeIndex - todayIndex + 7) % 7;
            return { ...task, daysAway };
        })
        .sort((a, b) => {
            if (a.daysAway !== b.daysAway) {
                return a.daysAway - b.daysAway;
            }
            const weightA = PRIORITY_WEIGHT[a.priority] || 0;
            const weightB = PRIORITY_WEIGHT[b.priority] || 0;
            return weightB - weightA;
        });
}

function renderUpcomingDeadlines(tasks) {

    const grid = document.getElementById("deadlinesGrid");

    if (!grid) {
        return;
    }

    const upcoming = getUpcomingTasks(tasks).slice(0, 4);

    if (upcoming.length === 0) {
        grid.innerHTML = `
            <p class="deadline-empty">
                No upcoming tasks yet.
                <a href="learning-planner.html">Add a task in the Learning Planner →</a>
            </p>
        `;
        return;
    }

    grid.innerHTML = upcoming
        .map(task => buildDeadlineCard(task, task.daysAway))
        .join("");
}

function renderUpcomingGoals(tasks) {

    const list = document.getElementById("upcomingGoalsList");

    if (!list) {
        return;
    }

    const upcoming = getUpcomingTasks(tasks).slice(0, 4);

    if (upcoming.length === 0) {
        list.innerHTML = `<li class="goals-empty">No upcoming tasks — add one in the Learning Planner.</li>`;
        return;
    }

    list.innerHTML = upcoming.map(task => {
        const safeTitle = String(task.title || "Untitled task")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        const dayLabel =
            task.daysAway === 0
                ? "Today"
                : task.daysAway === 1
                    ? "Tomorrow"
                    : task.day;

        return `<li>📅 ${safeTitle} - ${dayLabel}</li>`;
    }).join("");
}

function renderWeeklyProgressChart(tasks) {

    const chartCanvas = document.getElementById("progressChart");

    if (!chartCanvas) {
        return;
    }

    const dayPercentages = PLANNER_DAYS.map(day => {
        const dayTasks = tasks.filter(task => task.day === day);

        if (dayTasks.length === 0) {
            return 0;
        }

        const doneCount = dayTasks.filter(task => task.done).length;

        return Math.round((doneCount / dayTasks.length) * 100);
    });

    if (weeklyProgressChart) {
        weeklyProgressChart.destroy();
    }

    weeklyProgressChart = new Chart(chartCanvas, {

        type: "line",

        data: {

            labels: PLANNER_DAY_LABELS,

            datasets: [{

                label: "Task Completion This Week",

                data: dayPercentages,

                borderColor: "#2563eb",

                backgroundColor:
                    "rgba(37,99,235,0.2)",

                tension: 0.4,

                fill: true
            }]
        },

        options: {

            responsive: true,

            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },

            plugins: {

                legend: {
                    display: true
                }
            }
        }
    });
}


/* =====================================================
   LOAD ALL DYNAMIC DASHBOARD DATA
   ===================================================== */

async function loadDashboardData() {

    let dashboardData = {
        resumeScore: null,
        githubScore: null,
        placementReadiness: null,
        careerResult: null,
        roadmapProgress: {}
    };

    let plannerTasks = [];

    try {

        const dashboardResponse = await fetch(
            `${API_BASE_URL}/api/dashboard`,
            { credentials: "include" }
        );

        if (dashboardResponse.ok) {
            dashboardData = await dashboardResponse.json();
        }

    } catch (error) {
        console.error("Could not load dashboard stats:", error);
    }

    try {

        const plannerResponse = await fetch(
            `${API_BASE_URL}/api/planner`,
            { credentials: "include" }
        );

        if (plannerResponse.ok) {
            const plannerResult = await plannerResponse.json();
            plannerTasks = Array.isArray(plannerResult.planner?.tasks)
                ? plannerResult.planner.tasks
                : [];
        }

    } catch (error) {
        console.error("Could not load planner data:", error);
    }

    renderStatsCards(dashboardData);
    renderSkillProgress(dashboardData);
    renderRecentActivity(dashboardData, plannerTasks);
    renderUpcomingDeadlines(plannerTasks);
    renderUpcomingGoals(plannerTasks);
    renderWeeklyProgressChart(plannerTasks);
}

loadDashboardData();


/* =====================================================
   TODAY'S TASKS -> GOAL COUNTER -> CONFETTI
   ===================================================== */

const taskList = document.getElementById("taskList");
const goalCount = document.getElementById("goalCount");

if (taskList && goalCount) {

    const checkboxes = taskList.querySelectorAll(".task-check");
    const totalTasks = checkboxes.length;

    function updateGoalCount() {

        const completed = taskList.querySelectorAll(".task-check:checked").length;

        goalCount.textContent = `${completed} / ${totalTasks}`;

        // fire confetti the moment every task gets checked
        if (completed === totalTasks && totalTasks > 0) {
            fireConfetti();
        }
    }

    function fireConfetti() {

        if (typeof confetti !== "function") {
            console.warn("canvas-confetti library not loaded");
            return;
        }

        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
        });
    }

    checkboxes.forEach((checkbox) => {

        checkbox.addEventListener("change", () => {

            const label = checkbox.closest("label");

            if (label) {
                label.classList.toggle("completed", checkbox.checked);
            }

            updateGoalCount();
        });
    });

    // set the initial count on page load
    updateGoalCount();
}


/* =====================================================
   LOGOUT + THEME TOGGLE
   ===================================================== */

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;

    try {
      await fetch(`${API_BASE_URL}/api/logout`, {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      window.location.replace("login.html");
    }
  });

  const toggle=document.getElementById("themeToggle");

if(localStorage.getItem("theme")=="dark"){

    document.body.classList.add("dark-mode");

    toggle.innerHTML="☀️";

}

toggle.onclick=function(){

    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){

        localStorage.setItem("theme","dark");

        toggle.innerHTML="☀️";

    }

    else{

        localStorage.setItem("theme","light");

        toggle.innerHTML="🌙";

    }

}
}

const menuBtn=document.getElementById("menuBtn");

const sidebar=document.getElementById("sidebar");

menuBtn.addEventListener("click",()=>{

sidebar.classList.toggle("show");

});