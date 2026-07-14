
/* ===========================================
   CareerCompass
   GitHub Analyzer
   Part 1
===========================================*/

const usernameInput = document.getElementById("username");
const analyzeBtn = document.getElementById("analyzeBtn");

let repositories = [];

/* ===============================
   Analyze Button
================================*/

analyzeBtn.addEventListener("click", () => {

    const username = usernameInput.value.trim();

    if(username === ""){

        alert("Please enter a GitHub username.");

        return;

    }

    analyzeGitHub(username);

});



/* ===============================
   Update Profile
================================*/

function updateProfile(profile){

    document.getElementById("avatar").src =
        profile.avatar_url;

    document.getElementById("profileName").textContent =
        profile.name || "No Name";

    document.getElementById("profileUsername").textContent =
        "@" + profile.login;

    document.getElementById("profileBio").textContent =
        profile.bio || "No bio available.";

    document.getElementById("location").textContent =
        profile.location || "-";

    document.getElementById("company").textContent =
        profile.company || "-";

    const joinDate = new Date(profile.created_at);

    document.getElementById("joined").textContent =
        joinDate.toDateString();

}

/* ===============================
   Update Statistics
================================*/

function updateStatistics(profile){

    document.getElementById("repos").textContent =
        profile.public_repos;

    document.getElementById("followers").textContent =
        profile.followers;

    document.getElementById("following").textContent =
        profile.following;

    let totalStars = 0;

    repositories.forEach(repo=>{

        totalStars += repo.stargazers_count;

    });

    document.getElementById("stars").textContent =
        totalStars;

}

/* ===============================
   Helper Functions
================================*/

function getRepositoryCount(){

    return repositories.length;

}

function getTotalStars(){

    let stars = 0;

    repositories.forEach(repo=>{

        stars += repo.stargazers_count;

    });

    return stars;

}

function getLanguages(){

    const languageMap = {};

    repositories.forEach(repo=>{

        if(repo.language){

            if(languageMap[repo.language]){

                languageMap[repo.language]++;

            }

            else{

                languageMap[repo.language]=1;

            }

        }

    });

    return languageMap;

}


/* ===========================================
   CareerCompass
   GitHub Analyzer
   Part 2
   Professional Score
   Repository Analysis
===========================================*/

/* ===============================
   Analyze after Profile Loading
================================*/

async function analyzeGitHub(username){

    console.log("CareerCompass JS Version 14");

        const spinner = document.getElementById("loadingSpinner");

        try{

if (spinner) {
    spinner.style.display = "block";
}

        const profileResponse = await fetch(
            `https://api.github.com/users/${username}`
        );

        if(!profileResponse.ok){

            alert("GitHub user not found.");

            return;

        }

        const profile = await profileResponse.json();

        const repoResponse = await fetch(profile.repos_url);

       repositories = await repoResponse.json();

 updateProfile(profile);

updateStatistics(profile);

try{
    updateLanguageSection();
    console.log("✅ updateLanguageSection");
}catch(e){console.error("❌ updateLanguageSection",e);}

try{
    calculateProfessionalScore(profile);

    generateCareerReadiness();
    console.log("✅ calculateProfessionalScore");
    console.log("✅ generateCareerReadiness");
}catch(e){
    console.error("❌ calculateProfessionalScore",e);
}

try{
    generateRecruiterReport(profile);
    console.log("✅ generateRecruiterReport");
}catch(e){console.error("❌ generateRecruiterReport",e);}

try{
    generateSkillGap();
    console.log("✅ generateSkillGap");
}catch(e){console.error("❌ generateSkillGap",e);}

try{
    analyzeRepositories();
    console.log("✅ analyzeRepositories");
}catch(e){console.error("❌ analyzeRepositories",e);}

try{
    generateRepositoryCards();
    console.log("✅ generateRepositoryCards");
}catch(e){console.error("❌ generateRepositoryCards",e);}

}

    catch(error){

        console.error(error);

        alert("Unable to fetch GitHub data. Check your internet connection or GitHub username.");

    }

    finally{

        if(spinner){
            spinner.style.display = "none"; 
        }
    }

}

/* ===============================
   Professional Score
================================*/

function calculateProfessionalScore(profile){

    let score = 0;

    score += Math.min(profile.public_repos * 2,30);

    score += Math.min(profile.followers,20);

    score += Math.min(getTotalStars(),20);

    score += Math.min(Object.keys(getLanguages()).length * 3,15);

    score += Math.min(repositories.length,15);

    if(score>100){

        score=100;

    }

    document.getElementById("professionalScore").textContent =
        score + "%";

    let level="Beginner";

    if(score>=85){

        level="Excellent Developer";

    }

    else if(score>=70){

        level="Advanced Developer";

    }

    else if(score>=50){

        level="Intermediate";

    }

    document.getElementById("scoreLevel").textContent =
        level;

    const circle =  document.getElementById("progressCircle");

    console.log("Circle:", circle);

    if(circle){

        const radius = 75;

    const circumference = 2 * Math.PI * radius;

    const offset =
        circumference - (score / 100) * circumference;

        circle.style.strokeDasharray = circumference;

        circle.style.strokeDashoffset = offset;
    }


    

}

/* ===============================
   Repository Analysis
================================*/

function analyzeRepositories(){

    if(repositories.length===0){

        return;

    }

    let bestRepo = repositories[0];

    let weakRepo = repositories[0];

    repositories.forEach(repo=>{

        let score = repositoryScore(repo);

        if(score>repositoryScore(bestRepo)){

            bestRepo = repo;

        }

        if(score<repositoryScore(weakRepo)){

            weakRepo = repo;

        }

    });

    updateBestRepository(bestRepo);

    updateWeakRepository(weakRepo);

}

/* ===============================
   Repository Score
================================*/

function repositoryScore(repo){

    let score = 0;

    score += repo.stargazers_count * 5;

    score += repo.forks_count * 4;

    if(repo.description){

        score += 15;

    }

    if(repo.language){

        score += 15;

    }

    if(repo.homepage){

        score += 20;

    }

    if(repo.has_issues){

        score += 5;

    }

    if(repo.license){

        score += 10;

    }

    if(score > 100){

        score = 100;

    }

    return score;

}

/* ===============================
   Best Repository
================================*/

function updateBestRepository(repo){

    document.getElementById("bestRepoName").textContent =
        repo.name;

    document.getElementById("bestRepoStars").textContent =
        repo.stargazers_count;

    document.getElementById("bestRepoLanguage").textContent =
        repo.language || "-";

    document.getElementById("bestRepoUpdated").textContent =
        new Date(repo.updated_at).toLocaleDateString();

}

/* ===============================
   Weak Repository
================================*/

function updateWeakRepository(repo){

    document.getElementById("weakRepoName").textContent =
        repo.name;

    document.getElementById("weakRepoStars").textContent =
        repo.stargazers_count;

    document.getElementById("weakRepoLanguage").textContent =
        repo.language || "-";

    document.getElementById("weakRepoUpdated").textContent =
        new Date(repo.updated_at).toLocaleDateString();

}

/* ===============================
   Repository Table
================================*/

function generateRepositoryCards(){

    const grid =
        document.getElementById("repositoryGrid");

    grid.innerHTML="";

    repositories

    .sort((a,b)=>
        repositoryScore(b)-repositoryScore(a))

    .forEach(repo=>{

        const score = repositoryScore(repo);

        grid.innerHTML +=

        `
        <div class="repository-card">

            <h3>${repo.name}</h3>

            <div class="repository-info">

                <span>💻 Language</span>

                <strong>

                ${repo.language || "-"}

                </strong>

            </div>

            <div class="repository-info">

                <span>⭐ Stars</span>

                <strong>

                ${repo.stargazers_count}

                </strong>

            </div>

            <div class="repository-info">

                <span>🍴 Forks</span>

                <strong>

                ${repo.forks_count}

                </strong>

            </div>

            <div class="repository-info">

                <span>📅 Updated</span>

                <strong>

                ${new Date(repo.updated_at)
                .toLocaleDateString()}

                </strong>

            </div>

          <div class="ai-analysis">

    <h4>🤖 AI Analysis</h4>

    <p>${generateAIReview(repo)}</p>

</div>

<div class="recruiter-review">

    ${generateRecruiterVerdict(repo)}

</div>

<div class="repository-actions">

    <div class="repository-score">

        ${getRepositoryBadge(score)}

    </div>

    <a
        href="${repo.html_url}"
        target="_blank"
        class="repository-link">

        Open Repository

    </a>

</div>

           
        </div>

        `;

    });

    document
.querySelectorAll(".repository-card")
.forEach((card,index)=>{

card.style.animationDelay =
(index*0.1)+"s";

});

}


function generateAIReview(repo){

    let review = [];

    // Description
    if(repo.description){

        review.push("✅ Well documented repository");

    }
    else{

        review.push("⚠ Add a repository description");

    }

    // Deployment
    if(repo.homepage){

        review.push("🌐 Live project deployed");

    }
    else{

        review.push("🚀 Deploy this project online");

    }

    // Stars
    if(repo.stargazers_count >= 10){

        review.push("⭐ Strong community interest");

    }
    else if(repo.stargazers_count > 0){

        review.push("⭐ Has received community appreciation");

    }
    else{

        review.push("📢 Promote this repository to gain visibility");

    }

    // Forks
    if(repo.forks_count >= 5){

        review.push("🍴 Frequently forked by developers");

    }

    // Language
    if(repo.language){

        review.push(`💻 Primary language: ${repo.language}`);

    }

    // Last update
    const days =
        Math.floor(
            (Date.now() - new Date(repo.updated_at))
            / (1000 * 60 * 60 * 24)
        );

    if(days <= 30){

        review.push("🟢 Actively maintained");

    }
    else{

        review.push("🟡 Consider updating this repository");

    }

    return review.join("<br>");

}

function getRepositoryBadge(score){

    if(score >= 80){

        return "🏆 Excellent";

    }

    if(score >= 60){

        return "🥇 Strong";

    }

    if(score >= 40){

        return "🥈 Good";

    }

    if(score >= 20){

        return "🥉 Average";

    }

    return "⚠ Needs Work";

}

/* ===========================================
   Dynamic Recruiter Review
===========================================*/

function generateRecruiterVerdict(repo){

    let verdict = [];

    // ⭐ Repository Popularity
    if(repo.stargazers_count >= 10){

        verdict.push("🌟 Excellent community engagement");

    }
    else if(repo.stargazers_count >= 3){

        verdict.push("⭐ Good repository popularity");

    }
    else{

        verdict.push("⚠ Increase repository visibility");

    }

    // 📖 Documentation
    if(repo.description){

        verdict.push("📖 Repository is well documented");

    }
    else{

        verdict.push("❌ Add a meaningful repository description");

    }

    // 🚀 Deployment
    if(repo.homepage){

        verdict.push("🚀 Live deployment available");

    }
    else{

        verdict.push("⚠ Deploy this project online");

    }

    // 🍴 Collaboration
    if(repo.forks_count >= 3){

        verdict.push("🤝 Good collaboration potential");

    }
    else{

        verdict.push("📌 Collaboration can be improved");

    }

    // 💻 Technology
    if(repo.language){

        verdict.push("💻 Built using " + repo.language);

    }

    return verdict.join("<br>");

}

/* ===========================================
   CareerCompass
   GitHub Analyzer
   Part 3
   Language Distribution
===========================================*/

let languageChart = null;

/* ===============================
   Update analyzeGitHub()
================================*/

// In analyzeGitHub(), after:
//
// generateRepositoryTable();
//
// ADD THIS:
//
// updateLanguageSection();

/* ===============================
   Language Section
================================*/

function updateLanguageSection(){

    const languages = getLanguages();

    const summary = document.getElementById("languageSummary");

    summary.innerHTML = "";

    const totalRepos = repositories.length || 1;

    Object.entries(languages)

    .sort((a,b)=>b[1]-a[1])

    .forEach(([language,count])=>{

        const percentage =

            Math.round((count/totalRepos)*100);

        summary.innerHTML +=

        `
        <div class="language-item">

            <div class="language-header">

                <span>${language}</span>

                <span>${count} Repositories</span>

            </div>

            <div class="language-progress">

                <div
                    class="language-bar"
                    style="width:${percentage}%;
                    background:${getLanguageColor(language)};">
                </div>

            </div>

            <small>${percentage}% of repositories</small>

        </div>
        `;

    });

    drawLanguageChart(languages);

}

function getLanguageColor(language){

    const colors = {

        HTML:"#E34F26",
        CSS:"#1572B6",
        JavaScript:"#F7DF1E",
        TypeScript:"#3178C6",
        Python:"#3776AB",
        Java:"#F89820",
        "C++":"#00599C",
        "C#":"#68217A",
        PHP:"#777BB4",
        Go:"#00ADD8",
        Rust:"#DEA584"

    };

    return colors[language] || "#2563eb";

}

/* ===============================
   Draw Chart
================================*/

function drawLanguageChart(languages){

    const ctx =
        document.getElementById("languageChart");

    if(languageChart){

        languageChart.destroy();

    }

    languageChart = new Chart(ctx,{

        type:"pie",

        data:{

            labels:Object.keys(languages),

            datasets:[{

                data:Object.values(languages),

                backgroundColor:[

                    "#2563eb",
                    "#16a34a",
                    "#f59e0b",
                    "#dc2626",
                    "#9333ea",
                    "#0ea5e9",
                    "#ec4899",
                    "#14b8a6"

                ],

                borderWidth:2

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    position:"bottom"

                }

            }

        }

    });

}

/* ===========================================
   AI GitHub Intelligence Engine
===========================================*/

function analyzeDeveloperProfile(){

    const analysis = {

        frontend:0,
        backend:0,
        aiml:0,
        mobile:0,
        devops:0,
        cloud:0,
        datascience:0,

        skills:[],
        missing:[],
        career:"",
        level:"Beginner"

    };

    repositories.forEach(repo=>{

        const lang = (repo.language || "").toLowerCase();

        switch(lang){

            case "html":
            case "css":
            case "javascript":

                analysis.frontend += 20;
                break;

            case "typescript":

                analysis.frontend += 25;
                break;

            case "java":

                analysis.backend += 20;
                break;

            case "python":

                analysis.aiml += 15;
                analysis.datascience += 15;
                break;

            case "c#":

                analysis.backend += 20;
                break;

            case "php":

                analysis.backend += 20;
                break;

            case "go":

                analysis.backend += 25;
                analysis.cloud += 15;
                break;

            case "dart":

                analysis.mobile += 30;
                break;

            case "kotlin":

                analysis.mobile += 30;
                break;

            case "swift":

                analysis.mobile += 30;
                break;

        }

    });

    if(analysis.frontend>100) analysis.frontend=100;
    if(analysis.backend>100) analysis.backend=100;
    if(analysis.aiml>100) analysis.aiml=100;
    if(analysis.mobile>100) analysis.mobile=100;
    if(analysis.cloud>100) analysis.cloud=100;
    if(analysis.datascience>100) analysis.datascience=100;

    return analysis;

}

/* ===========================================
   Career Readiness
===========================================*/

function generateCareerReadiness(){

    const analysis = analyzeDeveloperProfile();

    setProgress(
        "frontendProgress",
        analysis.frontend
    );

    setProgress(
        "backendProgress",
        analysis.backend
    );

    setProgress(
        "fullstackProgress",
        Math.min(
            Math.round(
                (analysis.frontend + analysis.backend) / 2
            ),
            100
        )
    );

    setProgress(
        "aiProgress",
        Math.max(
            analysis.aiml,
            analysis.datascience
        )
    );

}

/* ===========================================
   Progress Bar Helper
===========================================*/

function setProgress(id,value){

    const bar = document.getElementById(id);

    if(!bar) return;

    bar.style.width = value + "%";

    bar.textContent = value + "%";

}

/* ===========================================
   Dynamic AI Career Report
===========================================*/

function generateRecruiterReport(profile){

    const analysis = analyzeDeveloperProfile();

    let career = "";
    let activity = "";
    let hire = 0;

    // ---------- Career Suggestion ----------

    if(analysis.frontend >= analysis.backend &&
       analysis.frontend >= analysis.aiml){

        career = "Frontend Developer";

    }

    else if(analysis.backend >= analysis.frontend &&
            analysis.backend >= analysis.aiml){

        career = "Backend Developer";

    }

    else if(analysis.aiml >= analysis.frontend &&
            analysis.aiml >= analysis.backend){

        career = "AI / Machine Learning Engineer";

    }

    else{

        career = "Software Developer";

    }

    // ---------- GitHub Activity ----------

    if(profile.public_repos >= 20){

        activity = "★★★★★";

    }

    else if(profile.public_repos >= 10){

        activity = "★★★★☆";

    }

    else if(profile.public_repos >= 5){

        activity = "★★★☆☆";

    }

    else{

        activity = "★★☆☆☆";

    }

    // ---------- Hire Probability ----------

    hire = Math.round(

        profile.followers * 0.4 +

        getTotalStars() * 0.8 +

        profile.public_repos * 2 +

        calculateRepositoryHealth() * 0.3

    );

   

    if(hire > 100){

        hire = 100;

    }

    // ---------- Update HTML ----------

    document.getElementById("careerSuggestion").textContent =
        career;

    document.getElementById("githubActivity").textContent =
        activity;

    document.getElementById("hireProbability").textContent =
        hire + "%";

}

function generateSkillGap(){

    const analysis = analyzeDeveloperProfile();

    const detected = [];

    const missing = [];

    if(analysis.frontend>0){

        detected.push("HTML");
        detected.push("CSS");
        detected.push("JavaScript");

    }

    if(analysis.backend>0){

        detected.push("Backend Development");

    }

    if(analysis.aiml>0){

        detected.push("Python");
        detected.push("Machine Learning");

    }

    if(analysis.mobile>0){

        detected.push("Mobile Development");

    }

    if(analysis.cloud>0){

        detected.push("Cloud");

    }

    const suggestions = [

        "React",

        "Node.js",

        "MongoDB",

        "Docker",

        "REST API",

        "CI/CD",

        "System Design"

    ];

    suggestions.forEach(skill=>{

        if(!detected.includes(skill)){

            missing.push(skill);

        }

    });

    document.getElementById("detectedSkills").innerHTML =
        detected.map(skill=>`<span class="skill-tag">${skill}</span>`).join("");

    document.getElementById("recommendedSkills").innerHTML =
        missing.map(skill=>`<span class="skill-tag missing">${skill}</span>`).join("");

    if(analysis.frontend>=60){

        document.getElementById("nextStep").textContent =
        "Build large React projects and learn backend development.";

    }

    else if(analysis.backend>=60){

        document.getElementById("nextStep").textContent =
        "Learn Cloud, Docker and System Design.";

    }

    else if(analysis.aiml>=50){

        document.getElementById("nextStep").textContent =
        "Create Deep Learning and Computer Vision projects.";

    }

    else{

        document.getElementById("nextStep").textContent =
        "Increase project quality and diversify your GitHub portfolio.";

    }

}

function calculateRepositoryHealth(){

    let health = 0;

    repositories.forEach(repo=>{

        if(repo.description) health++;

        if(repo.homepage) health++;

        if(repo.stargazers_count>0) health++;

        if(repo.language) health++;

        if(repo.license) health++;

    });

    return Math.round(
        (health/(repositories.length*5))*100
    );

}