"use strict";

const API_BASE_URL =
  ["127.0.0.1", "localhost"].includes(window.location.hostname) &&
  window.location.port !== "5000"
    ? "http://127.0.0.1:5000"
    : window.location.origin;

/* ============================================================
   Small helpers for reading/writing the switch (toggle) elements
   ============================================================ */

function setToggleState(toggleEl, isOn) {
    if (!toggleEl) return;
    toggleEl.classList.toggle("on", Boolean(isOn));
}

function isToggleOn(toggleEl) {
    if (!toggleEl) return false;
    return toggleEl.classList.contains("on");
}

/* ============================================================
   Profile tab (existing, unchanged)
   ============================================================ */

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

/* ============================================================
   Settings tab (Study Planner / Notifications / Privacy / Integrations)
   ============================================================ */

async function loadSettingsIntoForm() {

    try {

        const response = await fetch(`${API_BASE_URL}/api/settings`, {
            credentials: "include"
        });

        if (response.status === 401) {
            window.location.replace("login.html");
            return;
        }

        const result = await response.json();

        if (!response.ok || !result.settings) {
            console.error("Could not load settings:", result.message);
            showToast("Could not load your saved preferences.");
            return;
        }

        const settings = result.settings;

        // --- Study Planner ---

        const studyDaysSelect = document.getElementById("studyDaysSelect");
        if (studyDaysSelect) {
            const savedDays = Array.isArray(settings.studyDays) ? settings.studyDays : [];
            Array.from(studyDaysSelect.options).forEach(option => {
                option.selected = savedDays.includes(option.value);
            });
        }

        const timeWindowInput = document.getElementById("timeWindowInput");
        if (timeWindowInput) {
            timeWindowInput.value = settings.timeWindow || "";
        }

        const reminderFrequencySelect = document.getElementById("reminderFrequencySelect");
        if (reminderFrequencySelect) {
            reminderFrequencySelect.value = settings.reminderFrequency || "Every study day";
        }

        setToggleState(
            document.getElementById("calendarSyncToggle"),
            settings.calendarSync
        );

        // --- Notifications ---

        const notifications = settings.notifications || {};

        setToggleState(
            document.getElementById("dailyRemindersToggle"),
            notifications.dailyStudyReminders
        );
        setToggleState(
            document.getElementById("streakAlertsToggle"),
            notifications.streakAlerts
        );
        setToggleState(
            document.getElementById("internshipAlertsToggle"),
            notifications.internshipDeadlineAlerts
        );
        setToggleState(
            document.getElementById("weeklyEmailToggle"),
            notifications.weeklyProgressEmail
        );

        // --- Privacy ---

        const privacy = settings.privacy || {};

        const visibilityValue = privacy.profileVisibility || "private";
        const visibilityRadio = document.querySelector(
            `input[name="profileVisibility"][value="${visibilityValue}"]`
        );
        if (visibilityRadio) {
            visibilityRadio.checked = true;
        }

        setToggleState(
            document.getElementById("shareAnalyticsToggle"),
            privacy.shareAnalyticsWithRecruiters
        );
        setToggleState(
            document.getElementById("includeScoresToggle"),
            privacy.includeTestScores
        );

        // --- Integrations: GitHub (real, computed) ---

        const ghStatus = document.getElementById("ghStatus");
        if (ghStatus) {
            if (settings.githubConnected) {
                ghStatus.textContent = "Connected";
                ghStatus.classList.add("connected");
                ghStatus.classList.remove("off");
            } else {
                ghStatus.textContent = "Not connected";
                ghStatus.classList.add("off");
                ghStatus.classList.remove("connected");
            }
        }

    } catch (error) {
        console.error("Could not load settings:", error);
        showToast("Could not load your saved preferences. Check your connection.");
    }
}

function collectSettingsPayload() {

    const studyDaysSelect = document.getElementById("studyDaysSelect");
    const studyDays = studyDaysSelect
        ? Array.from(studyDaysSelect.selectedOptions).map(option => option.value)
        : [];

    const timeWindow = document.getElementById("timeWindowInput")?.value.trim() || "";
    const reminderFrequency = document.getElementById("reminderFrequencySelect")?.value || "Every study day";
    const calendarSync = isToggleOn(document.getElementById("calendarSyncToggle"));

    const notifications = {
        dailyStudyReminders: isToggleOn(document.getElementById("dailyRemindersToggle")),
        streakAlerts: isToggleOn(document.getElementById("streakAlertsToggle")),
        internshipDeadlineAlerts: isToggleOn(document.getElementById("internshipAlertsToggle")),
        weeklyProgressEmail: isToggleOn(document.getElementById("weeklyEmailToggle"))
    };

    const checkedVisibility = document.querySelector('input[name="profileVisibility"]:checked');

    const privacy = {
        profileVisibility: checkedVisibility ? checkedVisibility.value : "private",
        shareAnalyticsWithRecruiters: isToggleOn(document.getElementById("shareAnalyticsToggle")),
        includeTestScores: isToggleOn(document.getElementById("includeScoresToggle"))
    };

    return {
        studyDays,
        timeWindow,
        reminderFrequency,
        calendarSync,
        notifications,
        privacy
    };
}

async function saveSettings() {

    const payload = collectSettingsPayload();

    const response = await fetch(`${API_BASE_URL}/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Could not save settings.");
    }

    return result;
}

/* ============================================================
   Page load
   ============================================================ */

loadProfileIntoForm();
loadSettingsIntoForm();

/* ============================================================
   Save button — saves Profile fields AND Settings preferences together
   ============================================================ */

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

            const profileResponse = await fetch(`${API_BASE_URL}/api/profile`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name, course, education, semester })
            });

            const profileResult = await profileResponse.json();

            if (!profileResponse.ok) {
                showToast(profileResult.message || "Could not save profile changes.");
                return;
            }

            await saveSettings();

            showToast("All changes saved.");

        } catch (error) {
            console.error("Save error:", error);
            showToast(error.message || "Could not save changes. Check your connection.");
        } finally {
            saveBtn.disabled = false;
        }
    });
}

/* ============================================================
   Password change (existing, unchanged)
   ============================================================ */

const updatePasswordBtn = document.getElementById("updatePasswordBtn");

if (updatePasswordBtn) {

    updatePasswordBtn.addEventListener("click", async () => {

        const currentPassword = document.getElementById("currentPasswordInput")?.value || "";
        const newPassword = document.getElementById("newPasswordInput")?.value || "";

        if (!currentPassword || !newPassword) {
            showToast("Please fill in both password fields.");
            return;
        }

        updatePasswordBtn.disabled = true;

        try {

            const response = await fetch(`${API_BASE_URL}/api/change-password`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const result = await response.json();

            if (!response.ok) {
                showToast(result.message || "Could not update password.");
                return;
            }

            showToast("Password updated successfully.");
            document.getElementById("currentPasswordInput").value = "";
            document.getElementById("newPasswordInput").value = "";

        } catch (error) {
            console.error("Password change error:", error);
            showToast("Could not update password. Check your connection.");
        } finally {
            updatePasswordBtn.disabled = false;
        }
    });
}

/* ============================================================
   Delete account (existing, unchanged)
   ============================================================ */

const deleteAccountBtn = document.getElementById("deleteAccountBtn");

if (deleteAccountBtn) {

    deleteAccountBtn.addEventListener("click", async () => {

        const confirmed = confirm(
            "This will permanently delete your account and all your data. This cannot be undone. Continue?"
        );

        if (!confirmed) {
            return;
        }

        deleteAccountBtn.disabled = true;

        try {

            const response = await fetch(`${API_BASE_URL}/api/account`, {
                method: "DELETE",
                credentials: "include"
            });

            const result = await response.json();

            if (!response.ok) {
                showToast(result.message || "Could not delete account.");
                deleteAccountBtn.disabled = false;
                return;
            }

            window.location.replace("index.html");

        } catch (error) {
            console.error("Delete account error:", error);
            showToast("Could not delete account. Check your connection.");
            deleteAccountBtn.disabled = false;
        }
    });
}