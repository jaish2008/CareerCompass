/* ==============================================================
   CareerCompass — AI Resume Analyzer (Vanilla JS)
   PDF.js + Mammoth.js + jsPDF
   ============================================================== */

(function () {
  "use strict";

  const API_BASE_URL =
    ["127.0.0.1", "localhost"].includes(window.location.hostname) &&
    window.location.port !== "5000"
      ? "http://127.0.0.1:5000"
      : window.location.origin;

  // ------- PDF.js worker -------
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }

  // ------- Config -------
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_EXTS = ["pdf", "docx", "txt"];

  const ROLE_DESCRIPTIONS = {
    "Frontend Developer": "Builds user interfaces using HTML, CSS, JavaScript and modern frameworks like React.",
    "Backend Developer": "Designs server-side logic, APIs and databases using Node.js, Python, Java or similar.",
    "Full Stack Developer": "Works across both frontend and backend of web applications end-to-end.",
    "AI/ML Engineer": "Builds machine learning models using Python, Pandas, Scikit-learn, TensorFlow and more.",
    "Data Analyst": "Analyzes data using SQL, Excel, Python, and creates dashboards in Power BI or Tableau.",
    "DevOps Engineer": "Automates deployment and infrastructure using Docker, Kubernetes, CI/CD and cloud platforms."
  };

  const ROLE_KEYWORDS = {
    "Frontend Developer": ["HTML","CSS","JavaScript","TypeScript","React","Bootstrap","Responsive Design","Git","API","Frontend"],
    "Backend Developer": ["Python","Java","Node.js","Express","Flask","Django","SQL","MongoDB","REST API","Authentication"],
    "Full Stack Developer": ["HTML","CSS","JavaScript","React","Node.js","Express","SQL","MongoDB","Git","REST API"],
    "AI/ML Engineer": ["Python","Machine Learning","Pandas","NumPy","Scikit-learn","TensorFlow","Data Preprocessing","Model Evaluation","Statistics","Deep Learning"],
    "Data Analyst": ["Excel","SQL","Python","Pandas","NumPy","Power BI","Tableau","Data Visualization","Statistics","Data Analysis"],
    "DevOps Engineer": ["Linux","Docker","Kubernetes","AWS","Azure","Git","GitHub Actions","CI/CD","Terraform","Deployment"]
  };

  const SECTION_PATTERNS = {
    "Contact Information": /(email|phone|mobile|linkedin|github|@|\+\d)/i,
    "Career Objective / Summary": /(objective|summary|profile|about\s*me|career\s*goal)/i,
    "Skills": /(skills|technical\s*skills|technologies|tools)/i,
    "Education": /(education|academic|bachelor|master|b\.?tech|b\.?e\.?|m\.?tech|degree|university|college|school|10th|12th|hsc|ssc)/i,
    "Experience": /(experience|employment|work\s*history|internship|worked\s*at)/i,
    "Projects": /(projects?|mini\s*project|major\s*project|final\s*year\s*project)/i,
    "Certificates": /(certificate|certification|coursera|udemy|nptel|credential)/i
  };

  const ACTION_VERBS = [
    "developed","designed","implemented","built","created","led","managed","optimized",
    "improved","achieved","reduced","increased","launched","integrated","automated",
    "analyzed","engineered","deployed","collaborated","delivered","organized","presented"
  ];

  // ------- DOM helpers -------
  const $ = (id) => document.getElementById(id);

  const els = {
    // upload
    dropzone: $("dropzone"),
    fileInput: $("resumeFile"),
    filePreview: $("filePreview"),
    fpName: $("fpName"), fpType: $("fpType"), fpSize: $("fpSize"),
    fpRemove: $("fpRemove"),
    uploadError: $("uploadError"),
    targetRole: $("targetRole"),
    roleDesc: $("roleDesc"),
    analyzeBtn: $("analyzeResumeBtn"),
    resetBtn: $("resetAnalyzerBtn"),

    // process
    processCard: $("analysisProcessCard"),
    status: $("analysisStatus"),
    progressBar: $("analysisProgressBar"),
    progressText: $("analysisProgressText"),
    steps: document.querySelectorAll("#analysisSteps li"),

    // results
    results: $("analysisResults"),
    atsScore: $("atsScore"),
    atsCircle: $("atsScoreCircle"),
    scoreLabel: $("scoreLabel"),
    atsBadge: $("atsStatusBadge"),
    scoreExplanation: $("scoreExplanation"),

    structure: $("structureScore"),
    skill: $("skillScore"),
    keyword: $("keywordScore"),
    length: $("lengthScore"),
    contact: $("contactScore"),
    achievement: $("achievementScore"),

    sectionResults: $("sectionResults"),
    detected: $("detectedSkillResults"),
    missing: $("missingKeywordResults"),

    wordCount: $("wordCount"),
    characterCount: $("characterCount"),
    sectionCount: $("sectionCount"),
    sectionCountStat: $("sectionCountStat"),
    matchedSkillCount: $("matchedSkillCount"),
    matchedSkillCountStat: $("matchedSkillCountStat"),
    emailDetected: $("emailDetected"),
    phoneDetected: $("phoneDetected"),
    achievementDetected: $("achievementDetected"),
    actionVerbDetected: $("actionVerbDetected"),

    suggestionResults: $("suggestionResults"),
    roleMatchResults: $("roleMatchResults"),
    bestMatchingRole: $("bestMatchingRole"),
    resumeStrengths: $("resumeStrengths"),
    resumeWeaknesses: $("resumeWeaknesses"),

    extractedText: $("extractedText"),
    copyBtn: $("copyExtractedTextBtn"),
    downloadBtn: $("downloadAnalysisBtn"),

    navToggle: $("navToggle"),
    siteNav: $("siteNav")
  };

  // ------- State -------
  const state = {
    file: null,
    extractedText: "",
    analysis: null,
    running: false
  };
  
  const RESUME_ML_SKILLS = ["python","java","javascript","html_css","sql","react","angular","vue","nodejs",
    "express","django","flask","mysql","postgresql","mongodb","docker","aws","azure","kubernetes"];


  async function predictCareerFromResume(text) {
    const lower = text.toLowerCase();
    const features = {};
    RESUME_ML_SKILLS.forEach(skill => {
      const term = skill.replace("_", ".");
      features[skill] = lower.includes(term) || lower.includes(skill) ? 1 : 0;
    });
    features.language_count = ["python","java","javascript","html_css","sql"].reduce((n,k)=>n+features[k],0);
    features.framework_count = ["react","angular","vue","nodejs","express","django","flask"].reduce((n,k)=>n+features[k],0);
    features.database_count = ["mysql","postgresql","mongodb"].reduce((n,k)=>n+features[k],0);
    features.platform_count = ["docker","aws","azure","kubernetes"].reduce((n,k)=>n+features[k],0);
 
    try {
      const CAREER_API_URL = ["127.0.0.1","localhost"].includes(window.location.hostname) ? "http://127.0.0.1:5000/predict" : `${window.location.origin}/predict`;
      const res = await fetch(CAREER_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: features })
      });
      if (!res.ok) {
        console.error("Resume ML prediction request failed with status", res.status);
        return;
      }
      const data = await res.json();
      console.log("✅ RESUME ML PREDICTION:", data);
      const card = document.getElementById("mlResumeCard");
      const text2 = document.getElementById("mlResumeText");
      if (card && text2) {
        const confidencePct = Math.round((data.confidence || 0) * 100);
        text2.textContent = `${data.primaryCareer} — ${confidencePct}% confidence`;
        card.style.display = "block";
      }
    } catch (e) { console.error("Resume ML prediction failed:", e); }
  }
 

  // ------- Utilities -------
  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };
  const extOf = (name) => (name.split(".").pop() || "").toLowerCase();
  const showError = (msg) => {
    els.uploadError.textContent = msg;
    els.uploadError.classList.remove("hidden");
  };
  const clearError = () => {
    els.uploadError.textContent = "";
    els.uploadError.classList.add("hidden");
  };

  // ------- Nav toggle -------
  els.navToggle && els.navToggle.addEventListener("click", () => {
    const open = els.siteNav.classList.toggle("open");
    els.navToggle.setAttribute("aria-expanded", String(open));
  });

  // ------- Role description -------
  const updateRoleDesc = () => {
    els.roleDesc.textContent = ROLE_DESCRIPTIONS[els.targetRole.value] || "";
  };
  els.targetRole.addEventListener("change", updateRoleDesc);
  updateRoleDesc();

  // ------- File handling -------
  function handleFile(file) {
    clearError();
    if (!file) return;

    const ext = extOf(file.name);
    if (!ALLOWED_EXTS.includes(ext)) {
      showError("Unsupported file type. Please upload a PDF, DOCX or TXT file.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      showError("File too large. Maximum allowed size is 5 MB.");
      return;
    }

    state.file = file;
    els.fpName.textContent = file.name;
    els.fpType.textContent = ext.toUpperCase();
    els.fpSize.textContent = formatSize(file.size);
    els.filePreview.classList.remove("hidden");
    els.analyzeBtn.disabled = false;
  }

  els.fileInput.addEventListener("change", (e) => handleFile(e.target.files[0]));

  ["dragenter", "dragover"].forEach(ev =>
    els.dropzone.addEventListener(ev, (e) => {
      e.preventDefault(); e.stopPropagation();
      els.dropzone.classList.add("dragover");
    })
  );
  ["dragleave", "drop"].forEach(ev =>
    els.dropzone.addEventListener(ev, (e) => {
      e.preventDefault(); e.stopPropagation();
      els.dropzone.classList.remove("dragover");
    })
  );
  els.dropzone.addEventListener("drop", (e) => {
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) { els.fileInput.value = ""; handleFile(f); }
  });
  els.dropzone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); els.fileInput.click(); }
  });

  els.fpRemove.addEventListener("click", () => {
    state.file = null;
    els.fileInput.value = "";
    els.filePreview.classList.add("hidden");
    els.analyzeBtn.disabled = true;
  });

  // ------- Reset -------
  els.resetBtn.addEventListener("click", resetAll);
  function resetAll() {
    state.file = null;
    state.extractedText = "";
    state.analysis = null;
    els.fileInput.value = "";
    els.filePreview.classList.add("hidden");
    els.analyzeBtn.disabled = true;
    els.results.classList.add("hidden");
    els.processCard.classList.add("hidden");
    clearError();
    els.steps.forEach(li => li.classList.remove("active", "done"));
    els.progressBar.style.width = "0%";
    els.progressText.textContent = "0%";
  }

  // ------- Text extraction -------
  async function extractText(file) {
    const ext = extOf(file.name);
    if (ext === "txt") return await file.text();

    if (ext === "pdf") {
      if (!window.pdfjsLib) throw new Error("PDF reader library is not available.");
      const buf = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
      let text = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(it => it.str).join(" ") + "\n";
      }
      if (!text.trim()) {
        throw new Error("This PDF may contain scanned images instead of selectable text. OCR is not included in this version.");
      }
      return text;
    }

    if (ext === "docx") {
      if (!window.mammoth) throw new Error("DOCX reader library is not available.");
      const buf = await file.arrayBuffer();
      const result = await window.mammoth.extractRawText({ arrayBuffer: buf });
      return result.value || "";
    }

    throw new Error("Unsupported file type.");
  }

  // ------- Step progress -------
  function setStep(n, statusText) {
    els.steps.forEach((li) => {
      const s = Number(li.dataset.step);
      li.classList.remove("active");
      if (s < n) li.classList.add("done");
      if (s === n) li.classList.add("active");
    });
    const pct = Math.round((n / els.steps.length) * 100);
    els.progressBar.style.width = pct + "%";
    els.progressText.textContent = pct + "%";
    if (statusText) els.status.textContent = statusText;
  }
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  // ------- Analysis pipeline -------
  els.analyzeBtn.addEventListener("click", runAnalysis);

  async function runAnalysis() {
    if (state.running || !state.file) return;
    state.running = true;
    clearError();
    els.analyzeBtn.disabled = true;
    els.analyzeBtn.querySelector(".btn-label").textContent = "Analyzing…";
    els.results.classList.add("hidden");
    els.processCard.classList.remove("hidden");
    els.steps.forEach(li => li.classList.remove("active", "done"));

    try {
      setStep(1, "Reading resume file…"); await wait(350);
      setStep(2, "Extracting text from file…");
      const text = await extractText(state.file);
      state.extractedText = text;
      if (!text || text.trim().length < 30) {
        throw new Error("No readable text found in the resume.");
      }

      setStep(3, "Detecting resume sections…"); await wait(300);
      setStep(4, "Matching career keywords…"); await wait(300);
      setStep(5, "Calculating ATS readiness…"); await wait(300);
      setStep(6, "Generating smart suggestions…"); await wait(300);

      const analysis = analyzeResume(text, els.targetRole.value);
      state.analysis = analysis;

      renderResults(analysis);
      predictCareerFromResume(text);

      setStep(7, "Resume analysis completed successfully.");
      els.results.classList.remove("hidden");
      els.results.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      console.error(err);
      showError(err.message || "Analysis failed. Please try another file.");
      els.processCard.classList.add("hidden");
    } finally {
      state.running = false;
      els.analyzeBtn.disabled = !state.file;
      els.analyzeBtn.querySelector(".btn-label").textContent = "Analyze Resume";
    }
  }

  // ------- Core analysis -------
  function analyzeResume(rawText, targetRole) {
    const text = rawText || "";
    const lower = text.toLowerCase();
    const words = text.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const charCount = text.length;

    // Sections
    const sections = Object.entries(SECTION_PATTERNS).map(([name, re]) => ({
      name, found: re.test(text)
    }));
    const sectionsFound = sections.filter(s => s.found).length;

    // Contact
    const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
    const phoneMatch = text.match(/(\+?\d[\d\s().-]{8,}\d)/);
    const hasEmail = !!emailMatch;
    const hasPhone = !!phoneMatch;

    // Achievements (numbers/percentages)
    const achievements = text.match(/\b\d+(\.\d+)?%|\b\d{2,}\+?\b/g) || [];
    const hasAchievements = achievements.length >= 2;

    // Action verbs
    const verbsFound = ACTION_VERBS.filter(v => new RegExp("\\b" + v + "\\b", "i").test(text));
    const hasActionVerbs = verbsFound.length >= 3;

    // Role keywords
    const roleKws = ROLE_KEYWORDS[targetRole] || [];
    const matched = roleKws.filter(k => new RegExp("\\b" + escapeRegex(k) + "\\b", "i").test(text));
    const missing = roleKws.filter(k => !matched.includes(k));

    // ---- Scoring (out of 100) ----
    let score = 0;
    // Contact info: 10
    let contactScore = (hasEmail ? 5 : 0) + (hasPhone ? 5 : 0);
    score += contactScore;
    // Career objective: 8
    const hasObjective = SECTION_PATTERNS["Career Objective / Summary"].test(text);
    if (hasObjective) score += 8;
    // Skills: 12
    const hasSkills = SECTION_PATTERNS["Skills"].test(text);
    if (hasSkills) score += 12;
    // Education: 10
    const hasEdu = SECTION_PATTERNS["Education"].test(text);
    if (hasEdu) score += 10;
    // Experience: 10
    const hasExp = SECTION_PATTERNS["Experience"].test(text);
    if (hasExp) score += 10;
    // Projects: 10
    const hasProj = SECTION_PATTERNS["Projects"].test(text);
    if (hasProj) score += 10;
    // Certificates: 5
    const hasCert = SECTION_PATTERNS["Certificates"].test(text);
    if (hasCert) score += 5;
    // Role keywords: 25
    const kwRatio = roleKws.length ? matched.length / roleKws.length : 0;
    const kwScore = Math.round(kwRatio * 25);
    score += kwScore;
    // Length: 5 (ideal 300-900 words)
    let lengthScore = 0;
    if (wordCount >= 300 && wordCount <= 900) lengthScore = 5;
    else if (wordCount >= 200 && wordCount < 300) lengthScore = 3;
    else if (wordCount > 900 && wordCount <= 1200) lengthScore = 3;
    else lengthScore = 1;
    score += lengthScore;
    // Action verbs + achievements: 5
    let achScore = 0;
    if (hasActionVerbs) achScore += 3;
    if (hasAchievements) achScore += 2;
    score += achScore;

    score = Math.max(0, Math.min(100, score));

    // Score category
    let label, badge, badgeClass, explanation;
    if (score >= 85)      { label = "Excellent ATS readiness"; badge = "Excellent"; badgeClass = "excellent"; explanation = "Your resume is well-structured with strong keyword coverage and clear sections."; }
    else if (score >= 70) { label = "Good resume with minor improvements needed"; badge = "Good"; badgeClass = "good"; explanation = "Your resume is solid. A few targeted improvements will make it even stronger."; }
    else if (score >= 50) { label = "Average resume — improvement recommended"; badge = "Average"; badgeClass = "average"; explanation = "Your resume covers the basics but is missing some important elements."; }
    else                  { label = "Weak ATS readiness — major improvements needed"; badge = "Needs Work"; badgeClass = "weak"; explanation = "Your resume needs significant improvements to pass ATS filters effectively."; }

    // Breakdown percentages
    const structurePctBase = sectionsFound / Object.keys(SECTION_PATTERNS).length;
    const breakdown = {
      structure: Math.round(structurePctBase * 100),
      skills: hasSkills ? 100 : 40,
      keywords: Math.round(kwRatio * 100),
      length: Math.round((lengthScore / 5) * 100),
      contact: (contactScore / 10) * 100,
      achievements: Math.round((achScore / 5) * 100)
    };

    // Suggestions
    const suggestions = buildSuggestions({
      hasObjective, hasSkills, hasEdu, hasExp, hasProj, hasCert,
      hasEmail, hasPhone, hasActionVerbs, hasAchievements,
      missing, targetRole, wordCount
    });

    // Strengths / Weaknesses
    const strengths = [];
    const weaknesses = [];
    if (hasEmail && hasPhone) strengths.push("Contact information detected"); else weaknesses.push("Missing complete contact information (email/phone)");
    if (hasSkills) strengths.push("Strong technical skills section"); else weaknesses.push("No dedicated skills section");
    if (hasProj) strengths.push("Projects included"); else weaknesses.push("No projects section detected");
    if (hasEdu) strengths.push("Education section available"); else weaknesses.push("Missing education section");
    if (matched.length >= roleKws.length * 0.6) strengths.push("Role-relevant keywords present"); else weaknesses.push("Limited role-specific keywords");
    if (wordCount >= 300 && wordCount <= 900) strengths.push("Good resume length"); else weaknesses.push("Resume length is not ideal (aim for 300–900 words)");
    if (hasAchievements) strengths.push("Measurable achievements detected"); else weaknesses.push("No measurable achievements or metrics");
    if (hasActionVerbs) strengths.push("Strong action verbs used"); else weaknesses.push("Few action verbs detected");
    if (hasCert) strengths.push("Certifications listed"); else weaknesses.push("No certifications listed");

    // Role matches
    const roleMatches = Object.keys(ROLE_KEYWORDS).map(role => {
      const kws = ROLE_KEYWORDS[role];
      const m = kws.filter(k => new RegExp("\\b" + escapeRegex(k) + "\\b", "i").test(text)).length;
      return { role, pct: Math.round((m / kws.length) * 100) };
    }).sort((a,b) => b.pct - a.pct);

    return {
      score, label, badge, badgeClass, explanation, breakdown,
      sections, sectionsFound,
      matched, missing,
      wordCount, charCount,
      hasEmail, hasPhone, hasAchievements, hasActionVerbs,
      achievementsCount: achievements.length,
      verbsCount: verbsFound.length,
      suggestions, strengths, weaknesses, roleMatches, targetRole
    };
  }

  function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  function buildSuggestions(ctx) {
    const out = [];
    if (!ctx.hasObjective) out.push({ t: "Add a clear career summary", d: "A 2–3 line summary at the top helps ATS and recruiters understand your goals quickly.", p: "High" });
    if (!ctx.hasSkills) out.push({ t: "Add a dedicated Skills section", d: "List your technical tools, languages and technologies in a clean, scannable section.", p: "High" });
    if (ctx.missing.length > 0) out.push({ t: "Add missing role-specific keywords", d: `Consider adding relevant ${ctx.targetRole} keywords such as: ${ctx.missing.slice(0,5).join(", ")}.`, p: "High" });
    if (!ctx.hasAchievements) out.push({ t: "Add measurable achievements", d: "Use numbers and percentages (e.g. 'improved performance by 40%') to quantify your impact.", p: "High" });
    if (!ctx.hasActionVerbs) out.push({ t: "Use strong action verbs", d: "Start bullet points with verbs like Developed, Built, Led, Optimized, Delivered.", p: "Medium" });
    if (!ctx.hasExp) out.push({ t: "Add internship or practical experience", d: "Even short internships or freelance work add credibility for entry-level roles.", p: "Medium" });
    if (!ctx.hasProj) out.push({ t: "Improve project descriptions", d: "Describe your role, the tech used, and the outcome for each project.", p: "Medium" });
    if (ctx.wordCount < 300) out.push({ t: "Expand your resume content", d: "Your resume seems short — aim for 300–900 words with clear sections.", p: "Medium" });
    if (ctx.wordCount > 900) out.push({ t: "Keep resume length concise", d: "A 1–2 page resume is ideal. Trim less relevant content to stay focused.", p: "Recommended" });
    if (!ctx.hasCert) out.push({ t: "Add technical tools and certifications", d: "Certifications from Coursera, Udemy, or NPTEL strengthen your profile.", p: "Recommended" });
    if (!ctx.hasEmail || !ctx.hasPhone) out.push({ t: "Complete your contact information", d: "Ensure your email and phone number are clearly listed at the top.", p: "High" });
    out.push({ t: "Proofread for spelling and formatting", d: "Consistent formatting and error-free text signal professionalism.", p: "Recommended" });
    return out;
  }

  // ------- Rendering -------
  function renderResults(a) {
    // ATS score circle
    animateScore(a.score);

    fetch(`${API_BASE_URL}/api/profile/score`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ resumeScore: a.score })
    }).catch(err => console.error("Could not save resume score:", err));
    
  els.scoreLabel.textContent = a.label;
    els.atsBadge.textContent = a.badge;
    els.atsBadge.className = "status-badge " + a.badgeClass;
    els.scoreExplanation.textContent = a.explanation;

    // Breakdown
    setBar(els.structure, a.breakdown.structure);
    setBar(els.skill, a.breakdown.skills);
    setBar(els.keyword, a.breakdown.keywords);
    setBar(els.length, a.breakdown.length);
    setBar(els.contact, a.breakdown.contact);
    setBar(els.achievement, a.breakdown.achievements);

    // Sections
    els.sectionResults.innerHTML = a.sections.map(s => `
      <div class="section-item ${s.found ? "found" : "missing"}">
        <span>${s.name}</span>
        <span class="tag">${s.found ? "Found" : "Missing"}</span>
      </div>
    `).join("");
    els.sectionCount.textContent = `${a.sectionsFound} / ${a.sections.length}`;
    els.sectionCountStat.textContent = a.sectionsFound;

    // Detected & Missing
    els.detected.innerHTML = a.matched.length
      ? a.matched.map(k => `<span class="chip matched">✓ ${k}</span>`).join("")
      : `<span class="chip-empty">No role-specific skills detected yet.</span>`;
    els.missing.innerHTML = a.missing.length
      ? a.missing.map(k => `<span class="chip missing">+ ${k}</span>`).join("")
      : `<span class="chip-empty">Great — no obvious missing keywords for this role!</span>`;

    els.matchedSkillCount.textContent = a.matched.length;
    els.matchedSkillCountStat.textContent = a.matched.length;

    // Stats
    els.wordCount.textContent = a.wordCount;
    els.characterCount.textContent = a.charCount;
    setDetect(els.emailDetected, "✉ Email", a.hasEmail);
    setDetect(els.phoneDetected, "📞 Phone", a.hasPhone);
    setDetect(els.achievementDetected, `📈 Achievements (${a.achievementsCount})`, a.hasAchievements);
    setDetect(els.actionVerbDetected, `⚡ Action Verbs (${a.verbsCount})`, a.hasActionVerbs);

    // Suggestions
    els.suggestionResults.innerHTML = a.suggestions.map((s, i) => `
      <li class="suggestion">
        <div class="num">${i + 1}</div>
        <div>
          <h4>${s.t}</h4>
          <p>${s.d}</p>
        </div>
        <span class="priority ${s.p === "High" ? "high" : s.p === "Medium" ? "med" : "rec"}">${s.p} Priority</span>
      </li>
    `).join("");

    // Role matches
    els.roleMatchResults.innerHTML = a.roleMatches.map(r => `
      <div class="rm-row ${r.role === a.targetRole ? "selected" : ""}">
        <span class="rm-name">${r.role}${r.role === a.targetRole ? " ⭐" : ""}</span>
        <div class="rm-bar"><div style="width:${r.pct}%"></div></div>
        <span class="rm-val">${r.pct}%</span>
      </div>
    `).join("");
    const best = a.roleMatches[0];
    els.bestMatchingRole.textContent = `Your resume currently matches ${best.role} roles most strongly (${best.pct}%).`;

    // Strengths & Weaknesses
    els.resumeStrengths.innerHTML = a.strengths.length
      ? a.strengths.map(s => `<li>${s}</li>`).join("")
      : `<li>No strengths detected yet — try improving key sections.</li>`;
    els.resumeWeaknesses.innerHTML = a.weaknesses.length
      ? a.weaknesses.map(s => `<li>${s}</li>`).join("")
      : `<li>No obvious weaknesses — great work!</li>`;

    // Extracted text
    els.extractedText.textContent = state.extractedText;
  }

  function setBar(el, pct) {
    if (!el) return;
    pct = Math.max(0, Math.min(100, pct));
    el.style.width = pct + "%";
    const val = el.parentElement.parentElement.querySelector(".bd-val");
    if (val) val.textContent = pct + "%";
  }
  function setDetect(el, label, yes) {
    el.textContent = `${label}: ${yes ? "Yes" : "No"}`;
    el.classList.remove("yes","no");
    el.classList.add(yes ? "yes" : "no");
  }

  function animateScore(finalScore) {
    const circumference = 2 * Math.PI * 52; // r=52
    els.atsCircle.style.strokeDasharray = circumference.toFixed(2);
    els.atsCircle.style.strokeDashoffset = circumference.toFixed(2);
    const offset = circumference - (finalScore / 100) * circumference;

    // color
    let color = "#DC2626";
    if (finalScore >= 85) color = "#16A34A";
    else if (finalScore >= 70) color = "#2563EB";
    else if (finalScore >= 50) color = "#F59E0B";
    els.atsCircle.style.stroke = color;

    // animate number
    const start = 0;
    const dur = 1200;
    const t0 = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - t0) / dur);
      els.atsScore.textContent = Math.round(start + (finalScore - start) * p);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    requestAnimationFrame(() => {
      els.atsCircle.style.strokeDashoffset = offset;
    });
  }

  // ------- Copy extracted text -------
  els.copyBtn.addEventListener("click", async (e) => {
    e.preventDefault(); e.stopPropagation();
    try {
      await navigator.clipboard.writeText(state.extractedText || "");
      const original = els.copyBtn.textContent;
      els.copyBtn.textContent = "✓ Copied!";
      setTimeout(() => (els.copyBtn.textContent = original), 1500);
    } catch {
      alert("Copy failed. Please select the text manually.");
    }
  });

  // ------- Download PDF report -------
  els.downloadBtn.addEventListener("click", () => {
    if (!state.analysis) return;
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const a = state.analysis;
      const now = new Date();
      const margin = 40;
      let y = margin;

      const line = (txt, size = 11, bold = false) => {
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(size);
        const lines = doc.splitTextToSize(txt, 515);
        lines.forEach(l => {
          if (y > 780) { doc.addPage(); y = margin; }
          doc.text(l, margin, y); y += size * 1.3;
        });
      };
      const gap = (n = 6) => { y += n; };

      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 595, 60, "F");
      doc.setTextColor(255,255,255);
      doc.setFont("helvetica","bold"); doc.setFontSize(20);
      doc.text("CareerCompass — Resume Analysis Report", margin, 38);
      doc.setTextColor(30,41,59);
      y = 90;

      line("File: " + (state.file ? state.file.name : "-"), 11, true);
      line("Target Role: " + a.targetRole, 11, true);
      line("Generated: " + now.toLocaleString(), 10);
      gap(10);

      line("ATS Readiness Score: " + a.score + " / 100", 16, true);
      line("Status: " + a.label, 12);
      line(a.explanation, 11);
      gap(10);

      line("Resume Statistics", 13, true);
      line("- Word Count: " + a.wordCount);
      line("- Character Count: " + a.charCount);
      line("- Sections Found: " + a.sectionsFound + " / " + a.sections.length);
      line("- Matched Role Skills: " + a.matched.length);
      line("- Email Detected: " + (a.hasEmail ? "Yes" : "No"));
      line("- Phone Detected: " + (a.hasPhone ? "Yes" : "No"));
      gap(6);

      line("Sections Detected", 13, true);
      a.sections.forEach(s => line("- " + s.name + ": " + (s.found ? "Found" : "Missing")));
      gap(6);

      line("Detected Skills", 13, true);
      line(a.matched.length ? a.matched.join(", ") : "None detected.");
      gap(6);

      line("Missing Role Keywords", 13, true);
      line(a.missing.length ? a.missing.join(", ") : "None. Great coverage!");
      gap(6);

      line("Strengths", 13, true);
      a.strengths.forEach(s => line("- " + s));
      gap(6);

      line("Areas to Improve", 13, true);
      a.weaknesses.forEach(s => line("- " + s));
      gap(6);

      line("Improvement Suggestions", 13, true);
      a.suggestions.forEach((s, i) => {
        line((i + 1) + ". " + s.t + "  [" + s.p + " Priority]", 11, true);
        line("   " + s.d, 10);
      });
      gap(10);

      doc.setTextColor(100,116,139);
      line("Disclaimer: This ATS score is an estimated project-based readiness score and does not represent the score of any specific recruitment platform.", 9);

      doc.save("CareerCompass-Resume-Analysis.pdf");
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF report. Please try again.");
    }
  });
})();