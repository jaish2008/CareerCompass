document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("cc-navbar-toggle");
    const links = document.getElementById("cc-navbar-links");

    if (toggle && links) {
        toggle.addEventListener("click", () => {
            links.classList.toggle("open");
        });
    }

    // Highlight the current page's link
    const currentPage = window.location.pathname.split("/").pop();
    document.querySelectorAll(".cc-navbar-links a").forEach(link => {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
});