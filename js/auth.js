// Password Show / Hide
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

if (togglePassword && password) {
    togglePassword.addEventListener("click", () => {
        if (password.type === "password") {
            password.type = "text";
            togglePassword.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            password.type = "password";
            togglePassword.classList.replace("fa-eye-slash", "fa-eye");
        }
    });
}

// Login Form
const loginForm = document.querySelector("form");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        window.location.href = "dashboard.html";

    });
}