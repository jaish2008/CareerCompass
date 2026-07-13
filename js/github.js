
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

    try{

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

calculateProfessionalScore(profile);

analyzeRepositories();

generateRepositoryTable();

updateLanguageSection();
    }

    catch(error){

        console.error(error);

        alert("Unable to connect to GitHub.");

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

    let languageCount = Object.keys(getLanguages()).length;

    score += Math.min(languageCount*3,15);

    let activeRepos = repositories.filter(repo=>!repo.fork).length;

    score += Math.min(activeRepos,15);

    if(score>100){

        score=100;

    }

    document.getElementById("professionalScore").textContent =
        score + "%";

    let level = "Beginner";

    if(score>=85){

        level="Excellent Developer";

    }

    else if(score>=70){

        level="Advanced";

    }

    else if(score>=50){

        level="Intermediate";

    }

    document.getElementById("scoreLevel").textContent =
        level;

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

    score += repo.stargazers_count*5;

    score += repo.forks_count*3;

    if(repo.description){

        score+=10;

    }

    if(repo.language){

        score+=10;

    }

    if(repo.homepage){

        score+=5;

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

function generateRepositoryTable(){

    const table =
        document.getElementById("repositoryTableBody");

    table.innerHTML="";

    repositories.forEach(repo=>{

        let score = repositoryScore(repo);

        let badge = "score-low";

        if(score>=40){

            badge="score-high";

        }

        else if(score>=20){

            badge="score-medium";

        }

        table.innerHTML +=

        `
        <tr>

            <td>
            <a href="${repo.html_url}" target="_blank" class="repo-link">
             🔗 ${repo.name}
            </a>
            </td>

            <td>${repo.language || "-"}</td>

            <td>${repo.stargazers_count}</td>

            <td>${new Date(repo.updated_at).toLocaleDateString()}</td>

            <td>

                <span class="score-badge ${badge}">

                    ${score}

                </span>

            </td>

        </tr>
        `;

    });

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

    document.getElementById("htmlCount").textContent =
        (languages.HTML || 0) + " Repositories";

    document.getElementById("cssCount").textContent =
        (languages.CSS || 0) + " Repositories";

    document.getElementById("jsCount").textContent =
        (languages.JavaScript || 0) + " Repositories";

    document.getElementById("pythonCount").textContent =
        (languages.Python || 0) + " Repositories";

    document.getElementById("javaCount").textContent =
        (languages.Java || 0) + " Repositories";

    drawLanguageChart(languages);

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
