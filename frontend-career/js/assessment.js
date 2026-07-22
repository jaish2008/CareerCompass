// ===========================
// INPUT FIELDS
// ===========================
const nameInput = document.getElementById("name");
const departmentInput = document.getElementById("department");
const semesterInput = document.getElementById("semester");
const cgpaInput = document.getElementById("cgpa");

const programmingInput = document.getElementById("programming");
const dsaInput = document.getElementById("dsa");
const webInput = document.getElementById("web");
const databaseInput = document.getElementById("database");
const communicationInput = document.getElementById("communication");

const careerInput = document.getElementById("career");

const hoursInput = document.getElementById("hours");
const projectsInput = document.getElementById("projects");
const githubInput = document.getElementById("github");


// ===========================
// PREVIEW ELEMENTS
// ===========================
const previewName = document.getElementById("previewName");
const previewDepartment = document.getElementById("previewDepartment");
const previewSemester = document.getElementById("previewSemester");
const previewCGPA = document.getElementById("previewCGPA");

const previewProgramming = document.getElementById("previewProgramming");
const previewDSA = document.getElementById("previewDSA");
const previewWeb = document.getElementById("previewWeb");
const previewDatabase = document.getElementById("previewDatabase");
const previewCommunication = document.getElementById("previewCommunication");

const previewCareer = document.getElementById("previewCareer");


// ===========================
// LIVE PREVIEW FUNCTION
// ===========================
function updatePreview(){
    previewName.textContent = nameInput.value || "Your Name";
    previewDepartment.textContent = departmentInput.value || "-";
    previewSemester.textContent = semesterInput.value || "-";
    previewCGPA.textContent = cgpaInput.value || "-";
    previewProgramming.textContent = programmingInput.value || "-";
    previewDSA.textContent = dsaInput.value || "-";
    previewWeb.textContent = webInput.value || "-";
    previewDatabase.textContent = databaseInput.value || "-";
    previewCommunication.textContent = communicationInput.value || "-";
    previewCareer.textContent = careerInput.value || "-";
}


// ===========================
// EVENT LISTENERS
// ===========================
nameInput.addEventListener("input", updatePreview);
departmentInput.addEventListener("input", updatePreview);
semesterInput.addEventListener("input", updatePreview);
cgpaInput.addEventListener("input", updatePreview);
programmingInput.addEventListener("change", updatePreview);
dsaInput.addEventListener("change", updatePreview);
webInput.addEventListener("change", updatePreview);
databaseInput.addEventListener("change", updatePreview);
communicationInput.addEventListener("change", updatePreview);
careerInput.addEventListener("change", updatePreview);

document.getElementById("analyzeBtn").addEventListener("click", async function () {

    const assessmentData = {
        name: nameInput.value,
        department: departmentInput.value,
        semester: semesterInput.value,
        cgpa: cgpaInput.value,
        programming: programmingInput.value,
        dsa: dsaInput.value,
        web: webInput.value,
        database_skill: databaseInput.value,
        communication: communicationInput.value,
        career: careerInput.value,
        study_hours: hoursInput.value,
        projects: projectsInput.value,
        github: githubInput.value
    };

    try {
        const response = await fetch("http://127.0.0.1:5002/api/assessment/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(assessmentData)
        });

        const result = await response.json();

        if (result.success) {
            const suggestions = result.improvement_suggestions.map(s => "• " + s).join("\n");
            alert(
                `Placement Prediction: ${result.placement_status}\n` +
                `Readiness: ${result.readiness_percentage}%\n` +
                `Confidence: ${result.confidence}%\n` +
                `Recommended Domain: ${result.recommended_domain}\n\n` +
                `Suggestions:\n${suggestions}`
            );
        }

    } catch (error) {
        console.error(error);
        alert("Unable to connect to the backend.");
    }
});