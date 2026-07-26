/* ===========================================
   CareerCompass
   GitHub Analyzer
   Part 1
===========================================*/


const usernameInput = document.getElementById("username");
const analyzeBtn = document.getElementById("analyzeBtn");

let repositories = [];

const CAREER_API_URL =
  ["127.0.0.1", "localhost"].includes(window.location.hostname) &&
  window.location.port !== "5000"
    ? "http://127.0.0.1:5000/predict"
    : `${window.location.origin}/predict`;
const API_BASE_URL =
  ["127.0.0.1", "localhost"].includes(window.location.hostname) &&
  window.location.port !== "5000"
    ? "http://127.0.0.1:5000"
    : window.location.origin;
/* ===============================
   Analyze Button
================================*/

analyzeBtn.addEventListener("click", async () => {

    const username = usernameInput.value.trim();

    if (username === "") {

        alert("Please enter a GitHub username.");
        return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "Analyzing...";

    try {
        await analyzeGitHub(username);
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = "Analyze";
    }
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

    console.log("CareerCompass JS Version 16");

        const spinner = document.getElementById("loadingSpinner");

        try{

if (spinner) {
    spinner.style.display = "block";
}

        const profileResponse = await fetch(
            `https://api.github.com/users/${username}`
        );

        if (!profileResponse.ok) {

    const remaining =
        profileResponse.headers.get("x-ratelimit-remaining");

    const resetValue =
        profileResponse.headers.get("x-ratelimit-reset");

    if (
        profileResponse.status === 403 ||
        profileResponse.status === 429
    ) {

        let message =
            "GitHub API request limit reached.";

        if (remaining === "0" && resetValue) {

            const resetTime = new Date(
                Number(resetValue) * 1000
            );

            message +=
                "\nTry again after: " +
                resetTime.toLocaleTimeString();
        }

        alert(message);

        return;
    }

    if (profileResponse.status === 404) {

        alert(
            "GitHub user not found. Enter only the username, for example: jaish2008"
        );

        return;
    }

    alert(
        `GitHub API error: ${profileResponse.status}`
    );

    return;
}

        const profile = await profileResponse.json();

       const repoResponse = await fetch(
    `${profile.repos_url}?per_page=100&sort=updated`
);

if (!repoResponse.ok) {
    throw new Error("Unable to fetch GitHub repositories.");
}

const allRepositories = await repoResponse.json();

repositories = allRepositories
    .filter(repo => !repo.fork)
    .slice(0, 8);

 updateProfile(profile);

updateStatistics(profile);

try{
    updateLanguageSection();
    console.log("✅ updateLanguageSection");
}catch(e){console.error("❌ updateLanguageSection",e);}

try{
    calculateProfessionalScore(profile);
   console.log("✅ calculateProfessionalScore");

}catch(e){
    console.error("❌ calculateProfessionalScore",e);
}

try{

    generateCareerReadiness();

    console.log("✅ generateCareerReadiness");

}catch(e){

    console.error("❌ generateCareerReadiness",e);

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

try{

    updatePortfolioHealth();
    console.log("✅ updatePortfolioHealth");

}catch(e){

    console.error("❌ updatePortfolioHealth",e);

}

try{

    generateActivityAnalytics();
    console.log("✅ generateActivityAnalytics");

}catch(e){

    console.error("❌ generateActivityAnalytics",e);

}

try {
    updateRepositoryInsights();
    console.log("✅ updateRepositoryInsights");
}
catch (error)
{
    console.error("❌ updateRepositoryInsights", error);
}

try {
    generatePortfolioSWOT();
    console.log("✅ generatePortfolioSWOT");
} catch (error) {
    console.error("❌ generatePortfolioSWOT", error);
}

try{

    await predictCareerUsingML();

    console.log("✅ AI Career Prediction");

}

catch(error){

    console.error(error);

    alert("Unable to get AI career prediction.");

    throw error;
}

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

    // Save the GitHub score to the backend so the Dashboard can show it later.
    fetch(`${API_BASE_URL}/api/profile/score`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ githubScore: score })
    }).catch(err => console.error("Could not save GitHub score:", err));

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

/* ===========================================
   Portfolio Health Dashboard
===========================================*/

function updatePortfolioHealth(){

    const documentation =
        Math.round(
            repositories.filter(r=>r.description).length
            / repositories.length * 100
        ) || 0;

    const deployment =
        Math.round(
            repositories.filter(r=>r.homepage).length
            / repositories.length * 100
        ) || 0;

    const quality =
        calculateRepositoryHealth();

    const community =
        Math.min(
            Math.round(
                (getTotalStars() +
                repositories.reduce(
                    (sum,r)=>sum+r.forks_count,0
                )) * 2
            ),
            100
        );

    const diversity =
        Math.min(
            Object.keys(getLanguages()).length * 20,
            100
        );

    setHealth("docHealth",documentation);

    setHealth("deployHealth",deployment);

    setHealth("qualityHealth",quality);

    setHealth("communityHealth",community);

    setHealth("diversityHealth",diversity);

}

function generateActivityAnalytics(){


    if(repositories.length===0){

        return;

    }

    const latestRepo = repositories.reduce((a,b)=>

        new Date(a.updated_at) >
        new Date(b.updated_at)

        ? a : b

    );



    const mostActive = repositories.reduce((a, b) =>
    new Date(a.pushed_at) > new Date(b.pushed_at) ? a : b
);


    const languages = getLanguages();

    let primary = "-";

    let max = 0;

    Object.entries(languages).forEach(([lang,count])=>{

        if(count>max){

            max=count;

            primary=lang;

        }

    });

    const activityScore = Math.min(

        repositories.length*5 +

        getTotalStars()*2 +

        Object.keys(languages).length*5,

        100

    );


    document.getElementById("mostActiveRepo").textContent =
        mostActive.name;

    document.getElementById("latestUpdate").textContent =
    new Date(latestRepo.pushed_at || latestRepo.updated_at)
        .toLocaleDateString();

    document.getElementById("primaryLanguage").textContent =
        primary;

    document.getElementById("activityScore").textContent =
        activityScore + "%";

}

function setHealth(id,value){

    const bar =
        document.getElementById(id);

    if(!bar) return;

    bar.style.width =
        value + "%";

}

function updateRepositoryInsights() {
    const totalElement = document.getElementById("totalRepos");
    const starredElement = document.getElementById("mostStarredRepo");
    const forkedElement = document.getElementById("mostForkedRepo");
    const recentElement = document.getElementById("recentActivity");

    if (
        !totalElement ||
        !starredElement ||
        !forkedElement ||
        !recentElement
    ) {
        return;
    }

    if (repositories.length === 0) {
        totalElement.textContent = "0";
        starredElement.textContent = "-";
        forkedElement.textContent = "-";
        recentElement.textContent = "-";
        return;
    }

    const mostStarred = repositories.reduce((best, repo) =>
        repo.stargazers_count > best.stargazers_count ? repo : best
    );

    const mostForked = repositories.reduce((best, repo) =>
        repo.forks_count > best.forks_count ? repo : best
    );

    const mostRecent = repositories.reduce((latest, repo) =>
        new Date(repo.pushed_at || repo.updated_at) >
        new Date(latest.pushed_at || latest.updated_at)
            ? repo
            : latest
    );

    totalElement.textContent = repositories.length;

    starredElement.textContent =
        `${mostStarred.name} (${mostStarred.stargazers_count} stars)`;

    forkedElement.textContent =
        `${mostForked.name} (${mostForked.forks_count} forks)`;

    recentElement.textContent =
        `${mostRecent.name} — ${new Date(
            mostRecent.pushed_at || mostRecent.updated_at
        ).toLocaleDateString()}`;
}

function generatePortfolioSWOT() {
    const languages = getLanguages();
    const languageCount = Object.keys(languages).length;

    const deployedCount =
        repositories.filter(repo => repo.homepage).length;

    const documentedCount =
        repositories.filter(repo => repo.description).length;

    const recentCount =
        repositories.filter(repo => {
            const lastPush = new Date(repo.pushed_at || repo.updated_at);
            const ageInDays =
                (Date.now() - lastPush.getTime()) /
                (1000 * 60 * 60 * 24);

            return ageInDays <= 90;
        }).length;

    const strengths = [];
    const weaknesses = [];
    const opportunities = [];
    const risks = [];

    // Strengths
    if (repositories.length >= 6) {
        strengths.push("Good number of public projects.");
    }

    if (languageCount >= 3) {
        strengths.push("Portfolio demonstrates technology diversity.");
    }

    if (recentCount >= 3) {
        strengths.push("Several repositories are actively maintained.");
    }

    if (getTotalStars() > 0) {
        strengths.push("Projects have received community appreciation.");
    }

    if (strengths.length === 0) {
        strengths.push("The GitHub profile provides a foundation for growth.");
    }

    // Weaknesses
    if (documentedCount < repositories.length / 2) {
        weaknesses.push("Many repositories need meaningful descriptions.");
    }

    if (deployedCount < repositories.length / 3) {
        weaknesses.push("Few projects provide live deployment links.");
    }

    if (languageCount < 3) {
        weaknesses.push("The portfolio has limited technology diversity.");
    }

    if (getTotalStars() === 0) {
        weaknesses.push("Repositories currently have limited visibility.");
    }

    if (weaknesses.length === 0) {
        weaknesses.push("No major structural weakness was detected.");
    }

    // Opportunities
    if (languages.JavaScript || languages.TypeScript) {
        opportunities.push("Build a React or full-stack web application.");
    }

    if (languages.Python) {
        opportunities.push("Create a data analysis or machine-learning project.");
    }

    if (!languages.TypeScript) {
        opportunities.push("Learn TypeScript for stronger production projects.");
    }

    opportunities.push("Contribute to open-source repositories.");

    // Risks
    if (recentCount === 0) {
        risks.push("Inactive repositories may reduce recruiter confidence.");
    }

    if (deployedCount === 0) {
        risks.push("Recruiters cannot directly test any live project.");
    }

    if (documentedCount === 0) {
        risks.push("Missing documentation makes projects difficult to evaluate.");
    }

    if (risks.length === 0) {
        risks.push("Maintain consistent activity to preserve portfolio quality.");
    }

    updateSWOTList("swotStrengths", strengths);
    updateSWOTList("swotWeaknesses", weaknesses);
    updateSWOTList("swotOpportunities", opportunities);
    updateSWOTList("swotThreats", risks);
}

function updateSWOTList(elementId, items) {
    const element = document.getElementById(elementId);

    if (!element) {
        return;
    }

    element.innerHTML = items
        .map(item => `<li>${item}</li>`)
        .join("");
}

async function fetchRepositoryLanguages(repo) {

    try {

        const response = await fetch(repo.languages_url);

        if (!response.ok) {
            return [];
        }

        const languageData = await response.json();

        return Object.keys(languageData);

    } catch (error) {

        console.error(
            `Unable to fetch languages for ${repo.name}:`,
            error
        );

        return [];
    }
}

function detectProgrammingLanguage(language, features) {

    const normalizedLanguage =
        String(language || "").toLowerCase();

    switch (normalizedLanguage) {

        case "html":
        case "css":
        case "scss":
        case "sass":
            features.html_css = 1;
            break;

        case "javascript":
            features.javascript = 1;
            break;

        case "typescript":
            features.typescript = 1;
            break;

        case "python":
            features.python = 1;
            break;

        case "java":
            features.java = 1;
            break;

        case "sql":
        case "plsql":
        case "tsql":
            features.sql = 1;
            break;

        case "c#":
            features.csharp = 1;
            break;

        case "c++":
            features.cpp = 1;
            break;

        case "php":
            features.php = 1;
            break;

        case "go":
            features.go = 1;
            break;

        case "rust":
            features.rust = 1;
            break;

        case "r":
            features.r_language = 1;
            break;
    }
}


async function buildMLFeatures() {

    const features = {

        html_css:0,
        javascript:0,
        typescript:0,
        python:0,
        java:0,
        sql:0,
        csharp:0,
        cpp:0,
        php:0,
        go:0,
        rust:0,
        r_language:0,

        react:0,
        angular:0,
        vue:0,
        nodejs:0,
        express:0,
        django:0,
        flask:0,
        spring_boot:0,
        aspnet:0,

        mysql:0,
        postgresql:0,
        mongodb:0,
        sqlite:0,
        redis:0,
        microsoft_sql_server:0,

        docker:0,
        aws:0,
        azure:0,
        gcp:0,
        kubernetes:0,
        terraform:0,

        language_count:0,
        framework_count:0,
        database_count:0,
        platform_count:0
    };

for (const repo of repositories) {

    detectProgrammingLanguage(
        repo.language,
        features
    );

}
    features.language_count = [

        features.html_css,
        features.javascript,
        features.typescript,
        features.python,
        features.java,
        features.sql,
        features.csharp,
        features.cpp,
        features.php,
        features.go,
        features.rust,
        features.r_language

    ].reduce((total, value)=>total + value,0);


features.framework_count = [
    features.react,
    features.angular,
    features.vue,
    features.nodejs,
    features.express,
    features.django,
    features.flask,
    features.spring_boot,
    features.aspnet
].reduce((total, value) => total + value, 0);


features.database_count = [
    features.mysql,
    features.postgresql,
    features.mongodb,
    features.sqlite,
    features.redis,
    features.microsoft_sql_server
].reduce((total, value) => total + value, 0);


features.platform_count = [
    features.docker,
    features.aws,
    features.azure,
    features.gcp,
    features.kubernetes,
    features.terraform
].reduce((total, value) => total + value, 0);

    return features;

}

async function predictCareerUsingML() {

    try{

        const featureData = await buildMLFeatures();

        console.log("======ML FEATURES ======");
        console.table(featureData);

        console.log("ML Features:", featureData);

        const response = await fetch(
            CAREER_API_URL,
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify(featureData)
            }
        );

        if(!response.ok){

            throw new Error(
                "Prediction API failed."
            );

        }

        const result = await response.json();

        console.log("ML Prediction:", result);

        updateMLPrediction(result);

    }

    catch(error){

        console.error(error);

        alert("Unable to get AI Career Prediction.");

    }

}

function updateMLPrediction(result){

    const career =
        document.getElementById("careerSuggestion");

    const confidence =
        document.getElementById("hireProbability");

    if(career){

        career.textContent =
            result.prediction;

    }

    if(confidence){

        confidence.textContent =
            result.confidence + "%";

    }

    const progress =
    document.getElementById(
        "confidenceProgress"
    );

if(progress){

    progress.style.width =
        result.confidence + "%";

    progress.textContent =
        result.confidence + "%";

}

const explanation =
    document.getElementById(
        "aiExplanation"
    );

if(explanation){

    explanation.innerHTML="";

    const features =
        result.received_features;

    if(features.html_css){

        explanation.innerHTML +=
        "<li>✅ HTML/CSS detected</li>";

    }

    if(features.javascript){

        explanation.innerHTML +=
        "<li>✅ JavaScript detected</li>";

    }

    if(features.python){

        explanation.innerHTML +=
        "<li>✅ Python detected</li>";

    }

    if(features.java){

        explanation.innerHTML +=
        "<li>✅ Java detected</li>";

    }

    explanation.innerHTML +=
    `<li>🎯 AI confidence: ${result.confidence}%</li>`;

}


    //-----------------------------

    const container =
        document.getElementById(
            "topCareerPredictions"
        );

    if(!container){

        return;

    }

    container.innerHTML = "";


    result.career_probabilities

        .slice(0,3)

        .forEach((career,index)=>{

            const medals = [

                "🥇",

                "🥈",

                "🥉"

            ];

            container.innerHTML +=

            `
            <div class="prediction-row">

                <span class="prediction-title">

                    ${medals[index]}
                    ${career.career}

                </span>

                <span class="prediction-score">

                    ${career.probability}%

                </span>

            </div>
            `;

        });

        updateCareerRoadmap(result.prediction);

        updateAssessment(result.received_features);

}

async function fetchRepositoryFiles(owner, repoName){

    try{

        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repoName}/contents`
        );

        if(!response.ok){

            return [];

        }

        return await response.json();

    }

    catch(error){

        console.error(error);

        return [];

    }

}

async function fetchTextFile(downloadUrl) {

    try {

        const response = await fetch(downloadUrl);

        if (!response.ok) {
            return "";
        }

        return await response.text();

    } catch (error) {

        console.error("Unable to read repository file:", error);

        return "";
    }
}

function detectPackageDependencies(packageText, features) {

    try {

        const packageData = JSON.parse(packageText);

        const dependencies = {
            ...(packageData.dependencies || {}),
            ...(packageData.devDependencies || {})
        };

        const dependencyNames = Object.keys(dependencies)
            .map(name => name.toLowerCase());

        const hasDependency = (...names) =>
            names.some(name => dependencyNames.includes(name));

        if (hasDependency("react", "react-dom", "next")) {
            features.react = 1;
        }

        if (hasDependency("@angular/core", "angular")) {
            features.angular = 1;
        }

        if (hasDependency("vue", "nuxt")) {
            features.vue = 1;
        }

        if (
            hasDependency(
                "express",
                "koa",
                "fastify",
                "nestjs",
                "@nestjs/core"
            )
        ) {
            features.nodejs = 1;
        }

        if (hasDependency("express")) {
            features.express = 1;
        }

        if (hasDependency("mongoose", "mongodb")) {
            features.mongodb = 1;
        }

        if (hasDependency("mysql", "mysql2", "sequelize")) {
            features.mysql = 1;
        }

        if (hasDependency("pg", "postgres", "postgresql")) {
            features.postgresql = 1;
        }

        if (hasDependency("redis", "ioredis")) {
            features.redis = 1;
        }

        if (
            dependencyNames.some(name =>
                name.startsWith("@aws-sdk/")
            ) ||
            hasDependency("aws-sdk")
        ) {
            features.aws = 1;
        }

        if (
            dependencyNames.length > 0 ||
            packageData.scripts
        ) {
            features.nodejs = 1;
        }

    } catch (error) {

        console.error("Invalid package.json:", error);
    }
}



//-- technology detection ----

async function detectTechnology(files, features) {

    for (const file of files) {

        const name = file.name.toLowerCase();

        switch (name) {

            case "package.json": {

                features.nodejs = 1;

                if (file.download_url) {

                    const packageText =
                        await fetchTextFile(file.download_url);

                    detectPackageDependencies(
                        packageText,
                        features
                    );
                }

                break;
            }

            case "requirements.txt":
                features.python = 1;
                break;

            case "dockerfile":
            case "docker-compose.yml":
            case "docker-compose.yaml":
                features.docker = 1;
                break;

            case "pom.xml":
                features.java = 1;
                features.spring_boot = 1;
                break;

            case "build.gradle":
            case "build.gradle.kts":
                features.java = 1;
                break;

            case "composer.json":
                features.php = 1;
                break;

            case "cargo.toml":
                features.rust = 1;
                break;

            case "go.mod":
                features.go = 1;
                break;
        }
    }
}


function updateCareerRoadmap(career){

    const roadmap =
        document.getElementById("careerRoadmap");

    if(!roadmap) return;

    const paths={

        "Frontend Developer":[
            ["📘","Learn HTML, CSS & JavaScript"],
            ["⚛️","Master React.js"],
            ["🎨","Build Responsive Websites"],
            ["🌐","Deploy Projects on Vercel"],
            ["💼","Apply for Frontend Jobs"]
        ],

        "Backend Developer":[
            ["🐍","Learn Node.js / Python"],
            ["🗄️","Master SQL & MongoDB"],
            ["🔗","Build REST APIs"],
            ["☁️","Deploy Backend Services"],
            ["💼","Apply for Backend Jobs"]
        ],

        "Full Stack Developer":[
            ["🌐","Frontend Development"],
            ["⚙️","Backend Development"],
            ["🗄️","Databases"],
            ["🚀","Deploy Full Stack Apps"],
            ["💼","Become Full Stack Engineer"]
        ],

        "AI/ML Engineer":[
            ["🐍","Master Python"],
            ["📊","Learn Machine Learning"],
            ["🧠","Deep Learning"],
            ["🤖","Build AI Projects"],
            ["💼","AI Engineer Jobs"]
        ],

        "Data Analyst":[
            ["📈","Excel"],
            ["🐍","Python"],
            ["🗄️","SQL"],
            ["📊","Power BI / Tableau"],
            ["💼","Data Analyst Jobs"]
        ]
    };

    const steps =
        paths[career] || paths["Full Stack Developer"];

    roadmap.innerHTML="";

    steps.forEach(step=>{

        roadmap.innerHTML+=`

        <div class="roadmap-step">

            <div class="roadmap-icon">

                ${step[0]}

            </div>

            <div class="roadmap-content">

                <h4>${step[1]}</h4>

            </div>

        </div>

        `;

    });

}

function updateAssessment(features){

    const strengths=[];
    const weaknesses=[];

    if(features.javascript)
        strengths.push("JavaScript skills detected");

    if(features.python)
        strengths.push("Python knowledge detected");

    if(features.html_css)
        strengths.push("Frontend development skills");

    if(features.react===0)
        weaknesses.push("Learn React");

    if(features.docker===0)
        weaknesses.push("Learn Docker");

    if(features.aws===0)
        weaknesses.push("Explore Cloud Computing");

    document.getElementById("strengthList").innerHTML =
        strengths.map(x=>`<li>✅ ${x}</li>`).join("");

    document.getElementById("weaknessList").innerHTML =
        weaknesses.map(x=>`<li>⚠ ${x}</li>`).join("");

}