// ---- Dummy data (replace with Firestore query later) ----
const internships = [
  {
    company:"Pixelworks Studio", role:"Frontend Developer Intern", type:"frontend",
    skills:["HTML","CSS","JavaScript"], gapSkills:[],
    match:91, seatsTotal:10, seatsFilled:6, deadlineDays:1, stipend:"₹8,000/mo"
  },
  {
    company:"Nimbus Cloud Labs", role:"Backend Developer Intern", type:"backend",
    skills:["Node.js","REST API","MongoDB"], gapSkills:["DSA"],
    match:64, seatsTotal:8, seatsFilled:7, deadlineDays:3, stipend:"₹10,000/mo"
  },
  {
    company:"NeuroVista AI", role:"AI/ML Research Intern", type:"aiml",
    skills:["Python","Statistics"], gapSkills:["Python","ML Basics"],
    match:38, seatsTotal:5, seatsFilled:2, deadlineDays:7, stipend:"Unpaid + Certificate"
  },
  {
    company:"Bright Byte Technologies", role:"Frontend Developer Intern", type:"frontend",
    skills:["HTML","CSS","JavaScript","Git"], gapSkills:[],
    match:84, seatsTotal:6, seatsFilled:6, deadlineDays:2, stipend:"₹6,000/mo"
  },
  {
    company:"Fintrail Systems", role:"Backend Developer Intern", type:"backend",
    skills:["Node.js","Express","DSA"], gapSkills:["DSA"],
    match:70, seatsTotal:12, seatsFilled:4, deadlineDays:12, stipend:"₹12,000/mo"
  },
  {
    company:"DataForge Analytics", role:"AI/ML Intern", type:"aiml",
    skills:["Python","Pandas","ML Basics"], gapSkills:["Python","ML Basics"],
    match:45, seatsTotal:4, seatsFilled:1, deadlineDays:15, stipend:"₹5,000/mo"
  }
];

let activeTab = "all";
let searchTerm = "";

function matchClass(m){
  if(m>=75) return "match-high";
  if(m>=50) return "match-mid";
  return "match-low";
}
function deadlineClass(d){
  if(d<=2) return "deadline-urgent";
  if(d<=7) return "deadline-soon";
  return "deadline-ok";
}
function seatFillClass(filled,total){
  const ratio = filled/total;
  if(ratio>=1) return "full";
  if(ratio>=0.7) return "filling";
  return "";
}

function render(){
  const list = document.getElementById("jobList");
  list.innerHTML = "";

  const filtered = internships.filter(j=>{
    const tabOk = activeTab === "all" || j.type === activeTab;
    const searchOk = !searchTerm ||
      j.company.toLowerCase().includes(searchTerm) ||
      j.role.toLowerCase().includes(searchTerm);
    return tabOk && searchOk;
  }).sort((a,b)=> b.match - a.match);

  if(filtered.length === 0){
    list.innerHTML = '<div style="padding:30px;text-align:center;color:var(--muted);font-size:13px;">No internships match this filter yet.</div>';
    return;
  }

  filtered.forEach(j=>{
    const seatsLeft = j.seatsTotal - j.seatsFilled;
    const isFull = seatsLeft <= 0;
    const fillPct = Math.min(100, (j.seatsFilled/j.seatsTotal)*100);

    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `
      <div class="job-top">
        <div class="job-title-block">
          <h3>${j.role}</h3>
          <div class="company">${j.company}</div>
          <div class="meta">
            <span>💰 ${j.stipend}</span>
            <span>📍 Remote / Hybrid</span>
          </div>
        </div>
        <div class="match-badge ${matchClass(j.match)}">
          <div class="pct">${j.match}%</div>
          <div class="lbl">Match</div>
        </div>
      </div>

      <div class="skill-chips">
        ${j.skills.map(s=>`<span class="chip ${j.gapSkills.includes(s)?'gap':''}">${s}</span>`).join("")}
      </div>

      <div class="job-bottom">
        <div class="seats-block">
          <div class="seats-label">
            <span>${isFull ? "Seats full" : `${seatsLeft} of ${j.seatsTotal} seats left`}</span>
            <span class="deadline-badge ${deadlineClass(j.deadlineDays)}">${j.deadlineDays<=1 ? "Last day" : j.deadlineDays+" days left"}</span>
          </div>
          <div class="seat-bar-track">
            <div class="seat-bar-fill ${seatFillClass(j.seatsFilled,j.seatsTotal)}" style="width:${fillPct}%"></div>
          </div>
        </div>
        <button class="apply-btn" ${isFull ? "disabled" : ""}>${isFull ? "Join Waitlist" : "Apply Now"}</button>
      </div>
    `;
    list.appendChild(card);
  });
}

document.querySelectorAll(".tab").forEach(tab=>{
  tab.addEventListener("click", ()=>{
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    tab.classList.add("active");
    activeTab = tab.dataset.tab;
    render();
  });
});

document.getElementById("searchInput").addEventListener("input", (e)=>{
  searchTerm = e.target.value.toLowerCase();
  render();
});

render();