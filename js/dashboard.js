"use strict";

const API_BASE_URL =
  ["127.0.0.1", "localhost"].includes(window.location.hostname) &&
  window.location.port !== "5000"
    ? "http://127.0.0.1:5000"
    : window.location.origin;


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
   LEARNING PROGRESS CHART
   ===================================================== */

const chartCanvas =
    document.getElementById("progressChart");


if (chartCanvas) {

    new Chart(chartCanvas, {

        type: "line",

        data: {

            labels: [
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun"
            ],

            datasets: [{

                label: "Learning Progress",

                data: [
                    20,
                    35,
                    45,
                    60,
                    70,
                    82,
                    91
                ],

                borderColor: "#2563eb",

                backgroundColor:
                    "rgba(37,99,235,0.2)",

                tension: 0.4,

                fill: true
            }]
        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    display: true
                }
            }
        }
    });
}


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