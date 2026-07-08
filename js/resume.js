const nameInput=document.getElementById("name");
const emailInput=document.getElementById("email");
const phoneInput=document.getElementById("phone");
const objectiveInput=document.getElementById("objective");
const skillsInput=document.getElementById("skills");

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