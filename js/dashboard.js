"use strict";

const API_BASE_URL = "http://127.0.0.1:5000";


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