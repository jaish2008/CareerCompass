const nameInput=document.getElementById("name");
const emailInput=document.getElementById("email");
const phoneInput=document.getElementById("phone");
const objectiveInput=document.getElementById("objective");
const skillsInput=document.getElementById("skills");
const company = document.getElementById("company");
const role = document.getElementById("role");
const duration = document.getElementById("duration");
const experienceDescription = document.getElementById("experienceDescription");
const certificateName = document.getElementById("certificateName");
const certificateIssuer = document.getElementById("certificateIssuer");
const certificateYear = document.getElementById("certificateYear");

nameInput.oninput=()=>{
document.getElementById("previewName").textContent=nameInput.value || "Your Name";
};

emailInput.oninput=()=>{
document.getElementById("previewEmail").textContent=emailInput.value || "Email";
};

phoneInput.oninput=()=>{
document.getElementById("previewPhone").textContent=phoneInput.value || "Phone";
};

objectiveInput.oninput=()=>{
document.getElementById("previewObjective").textContent=objectiveInput.value;
};

skillsInput.oninput=()=>{
document.getElementById("previewSkills").textContent=skillsInput.value;
};

const degreeInput = document.getElementById("degree");
const collegeInput = document.getElementById("college");
const yearInput = document.getElementById("year");
const cgpaInput = document.getElementById("cgpa");

degreeInput.oninput = () => {
    document.getElementById("previewDegree").textContent = degreeInput.value;
};

collegeInput.oninput = () => {
    document.getElementById("previewCollege").textContent = collegeInput.value;
};

yearInput.oninput = () => {
    document.getElementById("previewYear").textContent = yearInput.value;
};

cgpaInput.oninput = () => {
    document.getElementById("previewCGPA").textContent = cgpaInput.value;
};

const saveBtn = document.getElementById("saveBtn");

saveBtn.addEventListener("click", function () {

    const resumeData = {

        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        objective: objectiveInput.value,
        skills: skillsInput.value,

        degree: degreeInput.value,
        college: collegeInput.value,
        year: yearInput.value,
        cgpa: cgpaInput.value,

        projectTitle: projectTitle.value,
        projectTech: projectTech.value,
        projectDescription:
            projectDescription.value,

        company: company.value,
        role: role.value,
        duration: duration.value,
        experienceDescription:
            experienceDescription.value,

        certificateName:
            certificateName.value,
        certificateIssuer:
            certificateIssuer.value,
        certificateYear:
            certificateYear.value
    };

    localStorage.setItem(
        "careerCompassResume",
        JSON.stringify(resumeData)
    );

    alert("Resume saved successfully!");
});

const resetBtn = document.getElementById("resetBtn");

resetBtn.addEventListener("click", function () {

    const confirmed = confirm(
        "Do you want to clear the resume?"
    );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(
        "careerCompassResume"
    );

    location.reload();
});

const projectTitle = document.getElementById("projectTitle");
const projectTech = document.getElementById("projectTech");
const projectDescription = document.getElementById("projectDescription");

projectTitle.oninput = () => {
    document.getElementById("previewProjectTitle").textContent = projectTitle.value;
};

projectTech.oninput = () => {
    document.getElementById("previewProjectTech").textContent =
        "Technology: " + projectTech.value;
};

projectDescription.oninput = () => {
    document.getElementById("previewProjectDescription").textContent =
        projectDescription.value;
};

company.oninput = () => {
    document.getElementById("previewCompany").textContent = company.value;
};

role.oninput = () => {
    document.getElementById("previewRole").textContent = role.value;
};

duration.oninput = () => {
    document.getElementById("previewDuration").textContent = duration.value;
};

experienceDescription.oninput = () => {
    document.getElementById("previewExperienceDescription").textContent =
        experienceDescription.value;
};

const previewCertificateName =
    document.getElementById("previewCertificateName");

const previewCertificateIssuer =
    document.getElementById("previewCertificateIssuer");

const previewCertificateYear =
    document.getElementById("previewCertificateYear");

    certificateName.addEventListener("input", function () {

    previewCertificateName.textContent =
        certificateName.value.trim() ||
        "Certificate Name";
});


certificateIssuer.addEventListener("input", function () {

    previewCertificateIssuer.textContent =
        certificateIssuer.value.trim()
            ? "Issued By: " + certificateIssuer.value.trim()
            : "";
});


certificateYear.addEventListener("input", function () {

    previewCertificateYear.textContent =
        certificateYear.value.trim()
            ? " | " + certificateYear.value.trim()
            : "";
});

const profilePhoto = 
        document.getElementById("profilePhoto");

 const previewPhoto =
        document.getElementById("previewPhoto");


profilePhoto.addEventListener("change", function () {

    const file = this.files[0];
   
    if (!file) {
        previewPhoto.style.display = "none";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {

        previewPhoto.src = event.target.result;
        previewPhoto.style.display = "block";

    };

    reader.readAsDataURL(file);
});

const downloadBtn = document.getElementById("downloadBtn");

downloadBtn.addEventListener("click", function () {

    const candidateName =
        document.getElementById("name").value.trim() ||
        "CareerCompass";

    const oldTitle = document.title;

    document.title =
        candidateName.replace(/\s+/g, "_") + "_Resume";

    window.print();

    setTimeout(function () {
        document.title = oldTitle;
    }, 1000);
});

window.addEventListener("DOMContentLoaded", function () {

    const savedResume =
        localStorage.getItem(
            "careerCompassResume"
        );

    if (!savedResume) {
        return;
    }

    const data = JSON.parse(savedResume);

    const fields = {
        name: nameInput,
        email: emailInput,
        phone: phoneInput,
        objective: objectiveInput,
        skills: skillsInput,

        degree: degreeInput,
        college: collegeInput,
        year: yearInput,
        cgpa: cgpaInput,

        projectTitle: projectTitle,
        projectTech: projectTech,
        projectDescription:
            projectDescription,

        company: company,
        role: role,
        duration: duration,
        experienceDescription:
            experienceDescription,

        certificateName:
            certificateName,
        certificateIssuer:
            certificateIssuer,
        certificateYear:
            certificateYear
    };

    Object.entries(fields).forEach(
        ([key, element]) => {

            if (
                element &&
                data[key] !== undefined
            ) {
                element.value = data[key];

                element.dispatchEvent(
                    new Event("input")
                );
            }
        }
    );
});