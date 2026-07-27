let internships = [];
let activeTab = "all";
let searchTerm = "";
 
async function loadInternships() {
    try {
      const response = await fetch(
    `https://careercompass-s0jp.onrender.com/api/internships?roleType=${activeTab}&skills=React,JavaScript`
);
 
        if (!response.ok) {
            throw new Error("Failed to fetch internships");
        }
 
        const data = await response.json();
 
        internships = data.results;
        render();
        renderNotifications();
 
    } catch (error) {
        console.error(error);
        document.getElementById("jobList").innerHTML =
            "<p>Failed to load internships.</p>";
    }
}
 
function matchClass(m){
    if(m >= 75) return "match-high";
    if(m >= 50) return "match-mid";
    return "match-low";
}
 
function render(){
 
    const list = document.getElementById("jobList");
    list.innerHTML = "";
 
    let filtered = internships.filter(job => {
 
        const tabOk =
            activeTab === "all" ||
            job.roleType === activeTab;
 
        const searchOk =
            job.title.toLowerCase().includes(searchTerm) ||
            job.company.toLowerCase().includes(searchTerm);
 
        return tabOk && searchOk;
 
    });
 
    if(filtered.length === 0){
        list.innerHTML="<p>No internships found.</p>";
        return;
    }
 
    filtered.forEach(job=>{
 
        const card=document.createElement("div");
        card.className="job-card";
 
        card.innerHTML=`
 
        <div class="job-top">
 
            <div class="job-title-block">
 
                <h3>${job.title}</h3>
 
                <div class="company">${job.company}</div>
 
                <div class="meta">
 
                    <span>📍 ${job.location}</span>
 
                    <span>💼 ${job.roleType}</span>
 
                </div>
 
            </div>
 
            <div class="match-badge ${matchClass(job.matchScore)}">
 
                <div class="pct">${job.matchScore}%</div>
 
                <div class="lbl">Match</div>
 
            </div>
 
        </div>
 
        <div class="skill-chips">
 
            ${job.skills.map(skill=>`<span class="chip">${skill}</span>`).join("")}
 
        </div>
 
        <div class="job-bottom">
 
            <a href="${job.applyUrl}" target="_blank">
 
                <button class="apply-btn">Apply Now</button>
 
            </a>
 
        </div>
 
        `;
 
        list.appendChild(card);
 
    });
 
}
 
// ============================================================
// NOTIFICATION BELL — real data only.
// Shows internships from the currently loaded list with a match
// score of 85%+. This is NOT deadline tracking (this page has no
// deadline data yet) — it's a genuine "top match" alert instead.
// ============================================================
const TOP_MATCH_THRESHOLD = 85;
 
function buildInternshipNotifications() {
    if (!Array.isArray(internships)) return [];
 
    return internships
        .filter(job => Number(job.matchScore) >= TOP_MATCH_THRESHOLD)
        .map(job => ({
            text: `${job.matchScore}% match: "${job.title}" at ${job.company}`
        }));
}
 
function renderNotifications() {
    const badge = document.getElementById("internBellBadge");
    const list = document.getElementById("internNotifList");
    if (!badge || !list) return;
 
    const notifs = buildInternshipNotifications();
 
    if (notifs.length) {
        badge.textContent = notifs.length;
        badge.classList.remove("hidden");
    } else {
        badge.classList.add("hidden");
    }
 
    list.innerHTML = notifs.length
        ? notifs.map(n => `<div class="intern-notif-item">${n.text}</div>`).join("")
        : `<p class="intern-notif-empty">No top matches (85%+) right now.</p>`;
}
 
const internBellBtn = document.getElementById("internBellBtn");
const internNotifPanel = document.getElementById("internNotifPanel");
 
if (internBellBtn && internNotifPanel) {
    internBellBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        internNotifPanel.classList.toggle("hidden");
    });
 
    document.addEventListener("click", (e) => {
        if (!internNotifPanel.contains(e.target) && e.target !== internBellBtn) {
            internNotifPanel.classList.add("hidden");
        }
    });
}
 
document.querySelectorAll(".tab").forEach(tab=>{
 
    tab.addEventListener("click",()=>{
 
        document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 
        tab.classList.add("active");
 
        activeTab = tab.dataset.tab;
 
        loadInternships();
 
    });
 
});
 
document.getElementById("searchInput").addEventListener("input",e=>{
 
    searchTerm = e.target.value.toLowerCase();
 
    render();
 
});
 
loadInternships();
 