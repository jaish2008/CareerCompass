// ===========================
// Project Roadmap — data source
// Edit THIS file to update the page. No HTML edits needed.
// roadmap.js reads this object and renders every section.
// ===========================

const roadmapData = {

  scope: {
    eyebrow: "Project Scope",
    heading: "A single, software-only web platform for placement preparation",
    description:
      "CareerCompass is built end-to-end as a web application — no external hardware " +
      "or IoT components are used. Every module runs in the browser and shares one " +
      "connected student profile, which is the core engineering focus of this project.",
    badges: [
      {
        icon: "fa-solid fa-laptop-code",
        title: "Software Only",
        subtitle: "No hardware / IoT dependency"
      },
      {
        icon: "fa-solid fa-user-group",
        title: "2 Team Members",
        subtitle: "Full-stack roles, split by module"
      },
      {
        icon: "fa-solid fa-layer-group",
        title: "8 Core Modules",
        subtitle: "One connected student profile"
      }
    ]
  },

  // Stats are derived automatically from `timeline` below (see computeStats()),
  // but you can override any of these by uncommenting and editing.
  // stats: [
  //   { label: "Modules Completed", value: "5 / 8", note: "On track" },
  // ],

  team: [
    {
      icon: "fa-solid fa-palette",
      name: "Member 1 — Interface & Experience",
      description:
        "Owns page structure, styling system, and the shared design language across every module.",
      tags: ["Assessment", "Resume Builder", "Dashboard"]
    },
    {
      icon: "fa-solid fa-diagram-project",
      name: "Member 2 — Logic & Scoring",
      description:
        "Owns data flow between modules, scoring engines, and the GitHub / Interview analysis logic.",
      tags: ["GitHub Analyzer", "Interview Prep", "Data Sync"]
    }
  ],

  // status: "done" | "active" | "upcoming"
  timeline: [
    {
      status: "done",
      phase: "Phase 1",
      title: "Foundation & Landing Page",
      description:
        "Project structure, navigation, hero section, and the feature overview students see before signing up.",
      tags: ["index.html", "style.css"]
    },
    {
      status: "done",
      phase: "Phase 2",
      title: "Authentication & Dashboard",
      description:
        "Login / signup flow and the central dashboard that reads readiness data from every other module.",
      tags: ["login.html", "dashboard.html"]
    },
    {
      status: "done",
      phase: "Phase 3",
      title: "Career Assessment",
      description:
        "Captures preferred career, semester and skill level — the profile every later module auto-fills from.",
      tags: ["assessment.html"]
    },
    {
      status: "done",
      phase: "Phase 4",
      title: "Resume Builder",
      description: "ATS-style resume scoring with live feedback as students edit their details.",
      tags: ["resume.html"]
    },
    {
      status: "done",
      phase: "Phase 5",
      title: "Interview Preparation",
      description:
        "Career-aware mock interviews with a rule-based scoring engine and a full performance report.",
      tags: ["interview.html", "questionBank.js"]
    },
    {
      status: "active",
      phase: "Phase 6",
      title: "GitHub Analyzer",
      description:
        "Pulls repository activity and turns it into a portfolio health score shown on the dashboard.",
      tags: ["github.html"]
    },
    {
      status: "active",
      phase: "Phase 7",
      title: "Cross-Module Data Sync",
      description:
        "Standardising the shared profile keys so every module reads and writes the same student data.",
      tags: ["localStorage", "profile schema"]
    },
    {
      status: "upcoming",
      phase: "Phase 8",
      title: "Testing, Polish & Final Report",
      description: "End-to-end testing across modules, responsive fixes, and the final project documentation.",
      tags: ["QA", "Docs"]
    }
  ],

  futureScope: [
    {
      emoji: "🧠",
      title: "Smarter Scoring",
      description:
        "Upgrade the interview scoring engine from keyword matching to a trained text-classification model (TF-IDF + logistic regression)."
    },
    {
      emoji: "🔄",
      title: "Self-Updating Question Bank",
      description:
        "Scheduled refresh of interview questions via a free automated workflow, keeping content current without manual work."
    },
    {
      emoji: "📊",
      title: "Deeper Analytics",
      description: "Trend charts across all modules so a student can see improvement over months, not just a single attempt."
    },
    {
      emoji: "☁️",
      title: "Optional Backend",
      description: "Move from localStorage to a lightweight database so progress can be accessed across devices."
    }
  ],

  team_size_note: "Frontend + Logic/AI"
};