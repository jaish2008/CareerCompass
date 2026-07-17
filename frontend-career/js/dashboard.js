const ctx = document.getElementById("progressChart");
const isDark = document.body.classList.contains("dark");

window.progressChart = new Chart(ctx, {
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
            data: [20, 35, 45, 60, 70, 82, 91],
            borderColor: "#2563eb",
            backgroundColor: "rgba(37,99,235,0.2)",
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                labels: { color: isDark ? "#f1f5f9" : "#1e293b" }
            }
        },
        scales: {
            x: {
                ticks: { color: isDark ? "#cbd5e1" : "#1e293b" },
                grid:  { color: isDark ? "#334155" : "#e2e8f0" }
            },
            y: {
                ticks: { color: isDark ? "#cbd5e1" : "#1e293b" },
                grid:  { color: isDark ? "#334155" : "#e2e8f0" }
            }
        }
    }
});