const ctx = document.getElementById("progressChart");

new Chart(ctx, {
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
                display: true
            }
        }
    }
});

const notifications = [
    "🎉 Resume Score improved to 84%",
    "💼 New Frontend Internship available.",
    "📚 JavaScript Roadmap updated.",
    "🤖 AI recommends learning React.js next."
];

const notificationList = document.querySelector(".notification-list");

notifications.forEach(notification => {

    const div = document.createElement("div");

    div.className = "notification-item";

    div.innerHTML = notification;

    notificationList.appendChild(div);

});