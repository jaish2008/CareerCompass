"use strict";

const API_BASE_URL = "http://127.0.0.1:5000";


/* =====================================================
   PASSWORD VISIBILITY
   ===================================================== */

const togglePassword =
    document.getElementById("togglePassword");

const passwordInput =
    document.getElementById("password");


if (togglePassword && passwordInput) {

    togglePassword.addEventListener(
        "click",
        function () {

            const passwordIsHidden =
                passwordInput.type === "password";

            passwordInput.type =
                passwordIsHidden
                    ? "text"
                    : "password";

            togglePassword.classList.toggle(
                "fa-eye",
                !passwordIsHidden
            );

            togglePassword.classList.toggle(
                "fa-eye-slash",
                passwordIsHidden
            );
        }
    );
}


/* =====================================================
   MESSAGE DISPLAY
   ===================================================== */

const authMessage =
    document.getElementById("authMessage");


function showAuthMessage(message, type) {

    if (!authMessage) {
        return;
    }

    authMessage.textContent = message;
    authMessage.className =
        `auth-message ${type}`;
}


function clearAuthMessage() {

    if (!authMessage) {
        return;
    }

    authMessage.textContent = "";
    authMessage.className = "auth-message";
}


/* =====================================================
   REQUEST HELPER
   ===================================================== */

async function sendAuthRequest(endpoint, payload) {

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify(payload)
        }
    );

    const data = await response
        .json()
        .catch(function () {
            return {
                status: "error",
                message: "The server returned an invalid response."
            };
        });

    return {
        response,
        data
    };
}


/* =====================================================
   SIGNUP FORM
   ===================================================== */

const signupForm =
    document.getElementById("signupForm");


if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();
            clearAuthMessage();

            const signupButton =
                document.getElementById(
                    "signupButton"
                );

            const name =
                document.getElementById(
                    "signupName"
                ).value.trim();

            const email =
                document.getElementById(
                    "signupEmail"
                ).value.trim();

            const password =
                passwordInput.value;

            const education =
                document.getElementById(
                    "signupEducation"
                ).value.trim();

            const course =
                document.getElementById(
                    "signupCourse"
                ).value.trim();

            const semester =
                document.getElementById(
                    "signupSemester"
                ).value.trim();


            if (password.length < 8) {

                showAuthMessage(
                    "Password must contain at least 8 characters.",
                    "error"
                );

                return;
            }


            signupButton.disabled = true;
            signupButton.textContent =
                "Creating Account...";


            try {

                const { response, data } =
                    await sendAuthRequest(
                        "/api/signup",
                        {
                            name,
                            email,
                            password,
                            education,
                            course,
                            semester
                        }
                    );


                if (!response.ok) {

                    showAuthMessage(
                        data.message ||
                        "Account could not be created.",
                        "error"
                    );

                    return;
                }


                showAuthMessage(
                    "Account created successfully. Opening your dashboard...",
                    "success"
                );


                setTimeout(function () {

                    window.location.href =
                        data.redirect ||
                        "/pages/dashboard.html";

                }, 500);

            } catch (error) {

                console.error(
                    "Signup request failed:",
                    error
                );

                showAuthMessage(
                    "Cannot connect to the CareerCompass server.",
                    "error"
                );

            } finally {

                signupButton.disabled = false;
                signupButton.textContent =
                    "Create Account";
            }
        }
    );
}


/* =====================================================
   LOGIN FORM
   ===================================================== */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();
            clearAuthMessage();

            const loginButton =
                document.getElementById(
                    "loginButton"
                );

            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();

            const password =
                passwordInput.value;

            const remember =
                document.getElementById(
                    "rememberLogin"
                ).checked;


            loginButton.disabled = true;
            loginButton.textContent =
                "Logging In...";


            try {

                const { response, data } =
                    await sendAuthRequest(
                        "/api/login",
                        {
                            email,
                            password,
                            remember
                        }
                    );


                if (!response.ok) {

                    showAuthMessage(
                        data.message ||
                        "Invalid email or password.",
                        "error"
                    );

                    return;
                }


                showAuthMessage(
                    "Login successful. Opening your dashboard...",
                    "success"
                );


                setTimeout(function () {

                    window.location.href =
                        data.redirect ||
                        "/pages/dashboard.html";

                }, 400);

            } catch (error) {

                console.error(
                    "Login request failed:",
                    error
                );

                showAuthMessage(
                    "Cannot connect to the CareerCompass server.",
                    "error"
                );

            } finally {

                loginButton.disabled = false;
                loginButton.textContent =
                    "Login";
            }
        }
    );
}


/* =====================================================
   REDIRECT USERS ALREADY LOGGED IN
   ===================================================== */

async function redirectAuthenticatedUser() {

    if (!signupForm && !loginForm) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/me`,
            {
                method: "GET",
                credentials: "include"
            }
        );


       const data = await response.json();

if (
    response.ok &&
    data.authenticated === true
) {

    window.location.href =
        "/pages/dashboard.html";
}

    } catch (error) {

        console.log(
            "No active backend session."
        );
    }
}


redirectAuthenticatedUser();