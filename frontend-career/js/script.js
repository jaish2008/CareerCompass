const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const menuIcon = menuToggle.querySelector("i");

menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("active");

    if (navLinks.classList.contains("active")) {

        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-xmark");

    } else {

        menuIcon.classList.remove("fa-xmark");
        menuIcon.classList.add("fa-bars");

    }

});

const navItems = document.querySelectorAll(".nav-links a");

navItems.forEach(item => {

    item.addEventListener("click", () => {

        navLinks.classList.remove("active");

        menuIcon.classList.remove("fa-xmark");
        menuIcon.classList.add("fa-bars");

    });

});