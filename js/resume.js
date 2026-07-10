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

saveBtn.onclick = () => {

    alert("Resume saved successfully!");

};

const resetBtn = document.getElementById("resetBtn");

resetBtn.onclick = () => {

    location.reload();

};

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

certificateName.oninput = () => {
    previewCertificateName.textContent = certificateName.value;
};

certificateIssuer.oninput = () => {
    previewCertificateIssuer.textContent =
        "Issued By: " + certificateIssuer.value;
};

certificateYear.oninput = () => {
    previewCertificateYear.textContent =
        " | " + certificateYear.value;
};

const profilePhoto = document.getElementById("profilePhoto");

profilePhoto.addEventListener("change", function(){

    const file = this.files[0];

    if(file){

        const reader = new FileReader();

        reader.onload = function(e){

            document.getElementById("previewPhoto").src = e.target.result;

        }

        reader.readAsDataURL(file);

    }

});

const downloadBtn = document.getElementById("downloadBtn");

downloadBtn.addEventListener("click",function(){

    const resume = document.querySelector(".resume-preview");

    html2pdf().from(resume).save("Resume.pdf");

});