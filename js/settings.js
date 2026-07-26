"use strict";

const API_BASE_URL =
  ["127.0.0.1", "localhost"].includes(window.location.hostname) &&
  window.location.port !== "5000"
    ? "http://127.0.0.1:5000"
    : window.location.origin;

async function loadProfileIntoForm() {

    try {

        const response = await fetch(`${API_BASE_URL}/api/me`, {
            credentials: "include"
        });

        if (response.status === 401) {
            window.location.replace("login.html");
            return;
        }

        const data = await response.json();

        if (!data.authenticated || !data.user) {
            window.location.replace("login.html");
            return;
        }

        const user = data.user;

        const nameInput = document.getElementById("settingsName");
        const emailInput = document.getElementById("settingsEmail");
        const courseInput = document.getElementById("settingsCourse");
        const educationInput = document.getElementById("settingsEducation");
        const semesterInput = document.getElementById("settingsSemester");

        if (nameInput) nameInput.value = user.name || "";
        if (emailInput) emailInput.value = user.email || "";
        if (courseInput) courseInput.value = user.course || "";
        if (educationInput) educationInput.value = user.education || "";
        if (semesterInput) semesterInput.value = user.semester || "";

    } catch (error) {
        console.error("Could not load profile:", error);
    }
}

loadProfileIntoForm();

const saveBtn = document.getElementById("saveBtn");

if (saveBtn) {

    saveBtn.addEventListener("click", async () => {

        const name = document.getElementById("settingsName")?.value.trim() || "";
        const course = document.getElementById("settingsCourse")?.value.trim() || "";
        const education = document.getElementById("settingsEducation")?.value.trim() || "";
        const semester = document.getElementById("settingsSemester")?.value.trim() || "";

        if (!name) {
            showToast("Name is required.");
            return;
        }

        saveBtn.disabled = true;

        try {

            const response = await fetch(`${API_BASE_URL}/api/profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name, course, education, semester })
            });

            const result = await response.json();

            if (!response.ok) {
                showToast(result.message || "Could not save changes.");
                return;
            }

            showToast("Changes saved.");

        } catch (error) {
            console.error("Save error:", error);
            showToast("Could not save changes. Check your connection.");
        } finally {
            saveBtn.disabled = false;
        }
    });
}