"use strict";

const API_BASE_URL =
  ["127.0.0.1", "localhost"].includes(window.location.hostname) &&
  window.location.port !== "5000"
    ? "http://127.0.0.1:5000"
    : window.location.origin;

const $ = (id) => document.getElementById(id);

/* =====================================================
   CAREER ROADMAP DATA
   ===================================================== */

const careerRoadmaps = {

    frontend: {
        name: "Frontend Developer",
        icon: "🎨",
        description:
            "Build responsive, interactive and accessible user interfaces for websites and web applications.",

        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "Responsive Design",
            "Git and GitHub",
            "React",
            "REST APIs",
            "Web Accessibility"
        ],

        stages: [
            {
                title: "Web Development Foundations",
                duration: "2–3 weeks",
                description:
                    "Learn how websites are structured and styled.",
                topics: [
                    "HTML Elements",
                    "Forms",
                    "CSS Selectors",
                    "Flexbox",
                    "Grid"
                ],
                project: "Build a responsive personal portfolio website."
            },
            {
                title: "JavaScript Fundamentals",
                duration: "3–4 weeks",
                description:
                    "Add logic, interaction and dynamic behaviour to web pages.",
                topics: [
                    "Variables",
                    "Functions",
                    "Arrays",
                    "Objects",
                    "DOM",
                    "Events"
                ],
                project: "Build a task manager using JavaScript."
            },
            {
                title: "Modern Frontend Development",
                duration: "4–5 weeks",
                description:
                    "Learn component-based development and API integration.",
                topics: [
                    "React",
                    "Components",
                    "State",
                    "Hooks",
                    "Fetch API"
                ],
                project: "Build a weather or career dashboard using an API."
            },
            {
                title: "Professional Frontend Skills",
                duration: "3–4 weeks",
                description:
                    "Improve performance, testing, accessibility and deployment.",
                topics: [
                    "Accessibility",
                    "Testing",
                    "Performance",
                    "Deployment"
                ],
                project: "Deploy a production-ready frontend application."
            }
        ],

        projects: [
            {
                title: "Responsive Portfolio",
                description:
                    "Create a professional portfolio with projects, skills and contact sections.",
                skills: ["HTML", "CSS", "Responsive Design"]
            },
            {
                title: "Task Management App",
                description:
                    "Create, update, complete and delete tasks using JavaScript.",
                skills: ["JavaScript", "DOM", "Local Storage"]
            },
            {
                title: "API Dashboard",
                description:
                    "Display live information from a public API in an interactive interface.",
                skills: ["React", "API", "Components"]
            }
        ]
    },

    backend: {
        name: "Backend Developer",
        icon: "⚙️",
        description:
            "Develop server-side logic, databases, APIs and secure application services.",

        skills: [
            "Python or Java",
            "Flask or Spring Boot",
            "SQL",
            "REST APIs",
            "Authentication",
            "Git and GitHub",
            "Database Design",
            "Deployment"
        ],

        stages: [
            {
                title: "Programming Foundations",
                duration: "3–4 weeks",
                description:
                    "Strengthen programming logic, functions and object-oriented programming.",
                topics: [
                    "Variables",
                    "Functions",
                    "OOP",
                    "Error Handling",
                    "File Handling"
                ],
                project: "Build a command-line student management system."
            },
            {
                title: "Database Development",
                duration: "3 weeks",
                description:
                    "Learn to design and query relational databases.",
                topics: [
                    "SQL",
                    "Tables",
                    "Joins",
                    "Constraints",
                    "Normalization"
                ],
                project: "Create a database for an internship tracker."
            },
            {
                title: "API Development",
                duration: "4 weeks",
                description:
                    "Build and test secure REST APIs.",
                topics: [
                    "Flask",
                    "Routes",
                    "JSON",
                    "CRUD",
                    "Authentication"
                ],
                project: "Build a career-planning REST API."
            },
            {
                title: "Deployment and Security",
                duration: "3 weeks",
                description:
                    "Deploy backend services and apply basic security practices.",
                topics: [
                    "Environment Variables",
                    "Validation",
                    "Security",
                    "Cloud Deployment"
                ],
                project: "Deploy a secure backend application."
            }
        ],

        projects: [
            {
                title: "Student Management API",
                description:
                    "Develop CRUD operations for managing student records.",
                skills: ["Python", "Flask", "REST API"]
            },
            {
                title: "Authentication System",
                description:
                    "Create signup, login, password hashing and session management.",
                skills: ["Authentication", "Database", "Security"]
            },
            {
                title: "Internship Tracker Backend",
                description:
                    "Store and manage internship applications and statuses.",
                skills: ["SQL", "Flask", "CRUD"]
            }
        ]
    },

    fullstack: {
        name: "Full Stack Developer",
        icon: "🌐",
        description:
            "Build complete web applications using frontend interfaces, backend services and databases.",

        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Python or Node.js",
            "SQL",
            "REST APIs",
            "Deployment"
        ],

        stages: [
            {
                title: "Frontend Foundations",
                duration: "3–4 weeks",
                description:
                    "Build responsive web interfaces.",
                topics: [
                    "HTML",
                    "CSS",
                    "JavaScript",
                    "Responsive Design"
                ],
                project: "Build a responsive dashboard."
            },
            {
                title: "Backend Foundations",
                duration: "4 weeks",
                description:
                    "Build server-side routes, logic and APIs.",
                topics: [
                    "Python",
                    "Flask",
                    "Routing",
                    "REST APIs"
                ],
                project: "Create a backend API for a task application."
            },
            {
                title: "Database Integration",
                duration: "3 weeks",
                description:
                    "Connect the application to a relational database.",
                topics: [
                    "SQL",
                    "Database Design",
                    "CRUD",
                    "Authentication"
                ],
                project: "Create a user account and data storage system."
            },
            {
                title: "Complete Application Deployment",
                duration: "4 weeks",
                description:
                    "Integrate and deploy the complete full-stack application.",
                topics: [
                    "API Integration",
                    "Testing",
                    "Security",
                    "Deployment"
                ],
                project: "Deploy a complete career guidance platform."
            }
        ],

        projects: [
            {
                title: "Career Tracker",
                description:
                    "Build a complete system for tracking skills and career progress.",
                skills: ["Frontend", "Backend", "Database"]
            },
            {
                title: "Learning Management App",
                description:
                    "Create courses, tasks, progress tracking and user accounts.",
                skills: ["React", "Flask", "SQL"]
            },
            {
                title: "Job Application Tracker",
                description:
                    "Manage applications, interview dates and statuses.",
                skills: ["CRUD", "Authentication", "Deployment"]
            }
        ]
    },

    software: {
        name: "Software Developer",
        icon: "💻",
        description:
            "Design, develop, test and maintain reliable software applications.",

        skills: [
            "Programming Fundamentals",
            "Object-Oriented Programming",
            "Data Structures",
            "Algorithms",
            "Git and GitHub",
            "Testing",
            "Database Fundamentals",
            "Problem Solving"
        ],

        stages: [
            {
                title: "Programming Fundamentals",
                duration: "3 weeks",
                description:
                    "Build strong logic and programming foundations.",
                topics: [
                    "Variables",
                    "Conditions",
                    "Loops",
                    "Functions",
                    "Arrays"
                ],
                project: "Build a console-based utility application."
            },
            {
                title: "Object-Oriented Programming",
                duration: "3 weeks",
                description:
                    "Learn classes, objects and reusable software design.",
                topics: [
                    "Classes",
                    "Objects",
                    "Inheritance",
                    "Encapsulation",
                    "Polymorphism"
                ],
                project: "Build a library management application."
            },
            {
                title: "Data Structures and Algorithms",
                duration: "5 weeks",
                description:
                    "Improve problem-solving and coding efficiency.",
                topics: [
                    "Lists",
                    "Stacks",
                    "Queues",
                    "Trees",
                    "Searching",
                    "Sorting"
                ],
                project: "Create a collection of solved algorithm problems."
            },
            {
                title: "Software Engineering Practices",
                duration: "4 weeks",
                description:
                    "Learn testing, version control and maintainable design.",
                topics: [
                    "Git",
                    "Testing",
                    "Debugging",
                    "Design Patterns"
                ],
                project: "Develop and test a complete software application."
            }
        ],

        projects: [
            {
                title: "Library Management System",
                description:
                    "Manage books, users, issue dates and returns.",
                skills: ["OOP", "Database", "Validation"]
            },
            {
                title: "Expense Manager",
                description:
                    "Record, classify and summarize user expenses.",
                skills: ["Programming", "File Handling", "Testing"]
            },
            {
                title: "Inventory System",
                description:
                    "Manage products, stock and transactions.",
                skills: ["OOP", "SQL", "CRUD"]
            }
        ]
    },

    aiml: {
        name: "AI/ML Engineer",
        icon: "🤖",
        description:
            "Build intelligent systems that learn from data and make predictions.",

        skills: [
            "Python",
            "NumPy",
            "Pandas",
            "Statistics",
            "Data Preprocessing",
            "Scikit-learn",
            "Model Evaluation",
            "Machine Learning"
        ],

        stages: [
            {
                title: "Python for Data Science",
                duration: "3 weeks",
                description:
                    "Learn Python tools used for data manipulation and analysis.",
                topics: [
                    "Python",
                    "NumPy",
                    "Pandas",
                    "Matplotlib"
                ],
                project: "Analyze a real-world CSV dataset."
            },
            {
                title: "Statistics and Data Preparation",
                duration: "3–4 weeks",
                description:
                    "Prepare data and understand statistical relationships.",
                topics: [
                    "Mean",
                    "Median",
                    "Probability",
                    "Missing Values",
                    "Encoding",
                    "Scaling"
                ],
                project: "Create a complete data preprocessing pipeline."
            },
            {
                title: "Machine Learning Models",
                duration: "5 weeks",
                description:
                    "Train supervised and unsupervised learning models.",
                topics: [
                    "Regression",
                    "Classification",
                    "Clustering",
                    "Feature Engineering"
                ],
                project: "Build a career prediction model."
            },
            {
                title: "Model Evaluation and Deployment",
                duration: "4 weeks",
                description:
                    "Evaluate, save and deploy machine-learning models.",
                topics: [
                    "Accuracy",
                    "Precision",
                    "Recall",
                    "F1 Score",
                    "Joblib",
                    "Flask API"
                ],
                project: "Deploy a machine-learning prediction API."
            }
        ],

        projects: [
            {
                title: "Career Prediction Model",
                description:
                    "Predict suitable careers using user skills and profile information.",
                skills: ["Scikit-learn", "Classification", "Evaluation"]
            },
            {
                title: "Food Freshness Predictor",
                description:
                    "Predict food freshness using sensor or historical data.",
                skills: ["Data Processing", "ML", "Prediction"]
            },
            {
                title: "Student Performance Predictor",
                description:
                    "Estimate student performance using academic information.",
                skills: ["Pandas", "Regression", "Visualization"]
            }
        ]
    },

    analyst: {
        name: "Data Analyst",
        icon: "📊",
        description:
            "Clean, analyze and visualize data to support better decisions.",

        skills: [
            "Excel",
            "SQL",
            "Python",
            "Pandas",
            "Data Cleaning",
            "Data Visualization",
            "Statistics",
            "Dashboard Design"
        ],

        stages: [
            {
                title: "Spreadsheet and Data Foundations",
                duration: "2–3 weeks",
                description:
                    "Learn spreadsheet formulas and data organization.",
                topics: [
                    "Excel",
                    "Formulas",
                    "Pivot Tables",
                    "Charts"
                ],
                project: "Create a sales analysis workbook."
            },
            {
                title: "SQL for Analysis",
                duration: "3 weeks",
                description:
                    "Extract and summarize information from databases.",
                topics: [
                    "SELECT",
                    "WHERE",
                    "GROUP BY",
                    "Joins",
                    "Subqueries"
                ],
                project: "Analyze an internship application database."
            },
            {
                title: "Python Data Analysis",
                duration: "4 weeks",
                description:
                    "Clean and analyze datasets using Python.",
                topics: [
                    "Python",
                    "Pandas",
                    "NumPy",
                    "Missing Values"
                ],
                project: "Analyze a student performance dataset."
            },
            {
                title: "Visualization and Reporting",
                duration: "3 weeks",
                description:
                    "Create dashboards and communicate findings.",
                topics: [
                    "Matplotlib",
                    "Charts",
                    "KPIs",
                    "Storytelling"
                ],
                project: "Build an interactive career analytics dashboard."
            }
        ],

        projects: [
            {
                title: "Sales Dashboard",
                description:
                    "Analyze sales, revenue and product performance.",
                skills: ["Excel", "Charts", "KPIs"]
            },
            {
                title: "Student Data Analysis",
                description:
                    "Identify academic trends and performance factors.",
                skills: ["Pandas", "Statistics", "Visualization"]
            },
            {
                title: "Placement Analytics",
                description:
                    "Analyze placement records and hiring trends.",
                skills: ["SQL", "Python", "Dashboard"]
            }
        ]
    },

    scientist: {
        name: "Data Scientist",
        icon: "🧪",
        description:
            "Use statistics, programming and machine learning to discover patterns and build predictive solutions.",

        skills: [
            "Python",
            "Statistics",
            "SQL",
            "Pandas",
            "Data Visualization",
            "Machine Learning",
            "Feature Engineering",
            "Experimentation"
        ],

        stages: [
            {
                title: "Data Science Foundations",
                duration: "4 weeks",
                description:
                    "Learn Python, SQL and data manipulation.",
                topics: [
                    "Python",
                    "Pandas",
                    "NumPy",
                    "SQL"
                ],
                project: "Explore and clean a public dataset."
            },
            {
                title: "Statistics and Visualization",
                duration: "4 weeks",
                description:
                    "Understand distributions, relationships and uncertainty.",
                topics: [
                    "Probability",
                    "Distributions",
                    "Correlation",
                    "Visualization"
                ],
                project: "Create an exploratory data analysis report."
            },
            {
                title: "Predictive Modelling",
                duration: "5 weeks",
                description:
                    "Train and compare machine-learning models.",
                topics: [
                    "Regression",
                    "Classification",
                    "Feature Engineering",
                    "Validation"
                ],
                project: "Build and compare predictive models."
            },
            {
                title: "Advanced Project and Communication",
                duration: "4 weeks",
                description:
                    "Solve a complete business problem and present findings.",
                topics: [
                    "Experimentation",
                    "Model Interpretation",
                    "Reporting",
                    "Deployment"
                ],
                project: "Complete an end-to-end data science case study."
            }
        ],

        projects: [
            {
                title: "Customer Churn Prediction",
                description:
                    "Predict which customers are likely to stop using a service.",
                skills: ["Classification", "Feature Engineering", "Evaluation"]
            },
            {
                title: "Demand Forecasting",
                description:
                    "Predict future demand using historical data.",
                skills: ["Time Series", "Statistics", "Python"]
            },
            {
                title: "Career Trends Analysis",
                description:
                    "Analyze developer careers, technologies and salary patterns.",
                skills: ["Data Analysis", "ML", "Visualization"]
            }
        ]
    },

    devops: {
        name: "DevOps Engineer",
        icon: "🔄",
        description:
            "Automate software development, testing, deployment and infrastructure workflows.",

        skills: [
            "Linux",
            "Git",
            "Networking",
            "Docker",
            "CI/CD",
            "Cloud Fundamentals",
            "Scripting",
            "Monitoring"
        ],

        stages: [
            {
                title: "Linux and Networking",
                duration: "3 weeks",
                description:
                    "Learn command-line administration and networking basics.",
                topics: [
                    "Linux Commands",
                    "Files",
                    "Permissions",
                    "IP",
                    "DNS"
                ],
                project: "Configure a Linux development environment."
            },
            {
                title: "Version Control and Scripting",
                duration: "3 weeks",
                description:
                    "Automate common development and repository tasks.",
                topics: [
                    "Git",
                    "GitHub",
                    "Bash",
                    "Python Scripts"
                ],
                project: "Create an automated project setup script."
            },
            {
                title: "Containers and CI/CD",
                duration: "4 weeks",
                description:
                    "Package applications and automate testing and deployment.",
                topics: [
                    "Docker",
                    "Images",
                    "Containers",
                    "GitHub Actions",
                    "CI/CD"
                ],
                project: "Containerize and automatically test an application."
            },
            {
                title: "Cloud and Monitoring",
                duration: "4 weeks",
                description:
                    "Deploy services and monitor their reliability.",
                topics: [
                    "Cloud",
                    "Deployment",
                    "Logs",
                    "Monitoring",
                    "Alerts"
                ],
                project: "Deploy and monitor a web application."
            }
        ],

        projects: [
            {
                title: "Dockerized Web Application",
                description:
                    "Package a frontend and backend application using Docker.",
                skills: ["Docker", "Linux", "Networking"]
            },
            {
                title: "CI/CD Pipeline",
                description:
                    "Automatically test and deploy code after every push.",
                skills: ["GitHub Actions", "Testing", "Deployment"]
            },
            {
                title: "Application Monitoring",
                description:
                    "Track service health, logs and failures.",
                skills: ["Monitoring", "Logs", "Alerts"]
            }
        ]
    },

    cloud: {
        name: "Cloud Engineer",
        icon: "☁️",
        description:
            "Design, deploy and manage scalable applications and infrastructure in cloud environments.",

        skills: [
            "Linux",
            "Networking",
            "Cloud Fundamentals",
            "Virtual Machines",
            "Storage",
            "Databases",
            "Security",
            "Deployment"
        ],

        stages: [
            {
                title: "Infrastructure Foundations",
                duration: "3 weeks",
                description:
                    "Learn operating systems, networking and infrastructure concepts.",
                topics: [
                    "Linux",
                    "Networking",
                    "Servers",
                    "Virtualization"
                ],
                project: "Set up a Linux virtual machine."
            },
            {
                title: "Cloud Services",
                duration: "4 weeks",
                description:
                    "Understand computing, storage and database services.",
                topics: [
                    "Compute",
                    "Storage",
                    "Databases",
                    "Identity"
                ],
                project: "Deploy a static website using cloud storage."
            },
            {
                title: "Cloud Application Deployment",
                duration: "4 weeks",
                description:
                    "Deploy and configure scalable web applications.",
                topics: [
                    "Application Hosting",
                    "Domains",
                    "Environment Variables",
                    "Scaling"
                ],
                project: "Deploy a complete web application."
            },
            {
                title: "Security and Monitoring",
                duration: "3 weeks",
                description:
                    "Protect resources and monitor cloud usage.",
                topics: [
                    "Access Control",
                    "Backups",
                    "Monitoring",
                    "Cost Management"
                ],
                project: "Create a secure cloud deployment plan."
            }
        ],

        projects: [
            {
                title: "Cloud Portfolio Deployment",
                description:
                    "Host a professional portfolio in a cloud environment.",
                skills: ["Storage", "Hosting", "DNS"]
            },
            {
                title: "Cloud Database Application",
                description:
                    "Connect a web application to a managed cloud database.",
                skills: ["Database", "Security", "Deployment"]
            },
            {
                title: "Scalable Web Service",
                description:
                    "Deploy and monitor a scalable web service.",
                skills: ["Compute", "Monitoring", "Scaling"]
            }
        ]
    },

    cybersecurity: {
        name: "Cybersecurity Analyst",
        icon: "🔐",
        description:
            "Protect systems, networks and information by identifying and responding to security threats.",

        skills: [
            "Networking",
            "Linux",
            "Security Fundamentals",
            "Threat Analysis",
            "Log Analysis",
            "Risk Assessment",
            "Incident Response",
            "Python Basics"
        ],

        stages: [
            {
                title: "Networking and Systems",
                duration: "4 weeks",
                description:
                    "Understand how networks and operating systems function.",
                topics: [
                    "TCP/IP",
                    "Ports",
                    "DNS",
                    "Linux",
                    "Windows"
                ],
                project: "Create a secure home network diagram."
            },
            {
                title: "Security Fundamentals",
                duration: "3 weeks",
                description:
                    "Learn common threats, vulnerabilities and controls.",
                topics: [
                    "Malware",
                    "Phishing",
                    "Authentication",
                    "Encryption",
                    "Access Control"
                ],
                project: "Perform a security risk assessment."
            },
            {
                title: "Monitoring and Threat Analysis",
                duration: "4 weeks",
                description:
                    "Analyze logs and identify suspicious activity.",
                topics: [
                    "Logs",
                    "SIEM Concepts",
                    "Indicators",
                    "Threat Detection"
                ],
                project: "Analyze sample security logs."
            },
            {
                title: "Incident Response",
                duration: "3 weeks",
                description:
                    "Learn how to document and respond to security incidents.",
                topics: [
                    "Identification",
                    "Containment",
                    "Recovery",
                    "Reporting"
                ],
                project: "Create an incident response plan."
            }
        ],

        projects: [
            {
                title: "Password Security Auditor",
                description:
                    "Evaluate password strength and provide safe recommendations.",
                skills: ["Python", "Validation", "Security"]
            },
            {
                title: "Log Analysis Dashboard",
                description:
                    "Identify suspicious patterns in sample system logs.",
                skills: ["Logs", "Analysis", "Visualization"]
            },
            {
                title: "Security Awareness Portal",
                description:
                    "Teach users about phishing, passwords and online safety.",
                skills: ["Web Development", "Security", "Education"]
            }
        ]
    }
};

/* =====================================================
   PAGE ELEMENTS
   ===================================================== */

const noCareerState = $("noCareerState");
const roadmapContent = $("roadmapContent");

const careerSelector = $("careerSelector");
const careerIcon = $("careerIcon");
const careerName = $("careerName");
const careerDescription = $("careerDescription");
const careerMatch = $("careerMatch");

const requiredSkills = $("requiredSkills");
const learningStages = $("learningStages");
const recommendedProjects = $("recommendedProjects");

const overallProgressText = $("overallProgressText");
const overallProgressBar = $("overallProgressBar");
const skillCompletionCount = $("skillCompletionCount");

let selectedCareerKey = "frontend";
let quizResult = null;
let roadmapReady = false;
let roadmapSaveTimer = null;

/* =====================================================
   GENERIC STORAGE HELPER
   ===================================================== */

function readStoredJSON(key, fallbackValue) {
    try {
        const storedValue = localStorage.getItem(key);

        if (!storedValue) {
            return fallbackValue;
        }

        return JSON.parse(storedValue);
    } catch (error) {
        console.error(`Unable to read ${key}:`, error);
        return fallbackValue;
    }
}

/* =====================================================
   LOAD QUIZ RESULT
   ===================================================== */

function loadQuizResult() {

    const savedResult =
        localStorage.getItem("careerCompassCareerResult");

    if (!savedResult) {
        noCareerState.classList.remove("hidden");
        roadmapContent.classList.add("hidden");
        return false;
    }

    try {
        quizResult = JSON.parse(savedResult);
    } catch (error) {
        console.error("Unable to load career result:", error);

        noCareerState.classList.remove("hidden");
        roadmapContent.classList.add("hidden");

        return false;
    }

    const resultKey =
        quizResult?.primaryCareer?.key;

    if (careerRoadmaps[resultKey]) {
        selectedCareerKey = resultKey;
    }

    noCareerState.classList.add("hidden");
    roadmapContent.classList.remove("hidden");

    return true;
}

/* =====================================================
   PROGRESS STORAGE (BROWSER)
   ===================================================== */

function getAllProgress() {
    return readStoredJSON("careerCompassRoadmapProgress", {});
}

function getCareerProgress(careerKey) {

    const allProgress = getAllProgress();

    return allProgress[careerKey] || {
        skills: [],
        stages: [],
        projects: []
    };
}

function saveCareerProgress(
    careerKey,
    progress
) {

    const allProgress = getAllProgress();

    allProgress[careerKey] = progress;

    localStorage.setItem(
        "careerCompassRoadmapProgress",
        JSON.stringify(allProgress)
    );
}

/* =====================================================
   PROGRESS STORAGE (ACCOUNT / BACKEND)
   ===================================================== */

async function loadRoadmapDataFromServer() {
    const response = await fetch(`${API_BASE_URL}/api/roadmap`, {
        method: "GET",
        credentials: "include"
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Unable to load Roadmap data.");
    }

    return result.roadmap || { allProgress: {}, summary: null };
}

async function saveRoadmapDataToServer() {
    if (!roadmapReady) {
        return;
    }

    const payload = {
        allProgress: getAllProgress(),
        summary: readStoredJSON("careerCompassRoadmapSummary", null)
    };

    const response = await fetch(`${API_BASE_URL}/api/roadmap`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Unable to save Roadmap data.");
    }
}

function scheduleRoadmapSave() {
    clearTimeout(roadmapSaveTimer);

    roadmapSaveTimer = setTimeout(() => {
        saveRoadmapDataToServer().catch((error) => {
            console.error("Roadmap database save failed:", error);
        });
    }, 400);
}

/* =====================================================
   CAREER MATCH
   ===================================================== */

function getCareerMatch(careerKey) {

    if (!quizResult) {
        return 0;
    }

    if (
        quizResult.primaryCareer?.key ===
        careerKey
    ) {
        return Number(
            quizResult.primaryCareer.percentage
        ) || 0;
    }

    const match =
        quizResult.topThree?.find(
            function (career) {
                return career.key === careerKey;
            }
        );

    return match
        ? Number(match.percentage) || 0
        : 0;
}

/* =====================================================
   RENDER CAREER SUMMARY
   ===================================================== */

 
function renderCareerSummary() {
 
    const career =
        careerRoadmaps[selectedCareerKey];
 
    careerIcon.textContent = career.icon;
    careerName.textContent = career.name;
    careerDescription.textContent =
        career.description;
 
    careerMatch.textContent =
        `${getCareerMatch(selectedCareerKey)}%`;
 
    careerSelector.value =
        selectedCareerKey;
 
    const existingBadge = document.getElementById("roadmapMlBadge");
    if (existingBadge) existingBadge.remove();
 
    const isMatchingQuizCareer =
        quizResult && quizResult.primaryCareer?.key === selectedCareerKey;
 
    if (isMatchingQuizCareer) {
        const badge = document.createElement("div");
        badge.id = "roadmapMlBadge";
        badge.style.display = "inline-block";
        badge.style.padding = "6px 14px";
        badge.style.borderRadius = "999px";
        badge.style.fontSize = "13px";
        badge.style.fontWeight = "700";
        badge.style.marginBottom = "12px";
 
        if (quizResult.usedML) {
            badge.textContent = "🧠 This roadmap follows your ML-predicted career";
            badge.style.background = "#dcfce7";
            badge.style.color = "#166534";
        } else {
            badge.textContent = "📋 This roadmap follows your quiz-based top match";
            badge.style.background = "#fef3c7";
            badge.style.color = "#92400e";
        }
 
        careerDescription.parentNode.insertBefore(badge, careerDescription);
    }
}

/* =====================================================
   RENDER SKILLS
   ===================================================== */

function renderSkills() {

    const career =
        careerRoadmaps[selectedCareerKey];

    const progress =
        getCareerProgress(selectedCareerKey);

    requiredSkills.innerHTML = "";

    career.skills.forEach(
        function (skill, index) {

            const label =
                document.createElement("label");

            label.className = "skill-item";

            const checkbox =
                document.createElement("input");

            checkbox.type = "checkbox";

            checkbox.checked =
                progress.skills.includes(index);

            if (checkbox.checked) {
                label.classList.add("completed");
            }

            const text =
                document.createElement("span");

            text.textContent = skill;

            checkbox.addEventListener(
                "change",
                function () {

                    toggleProgressItem(
                        "skills",
                        index,
                        checkbox.checked
                    );

                    label.classList.toggle(
                        "completed",
                        checkbox.checked
                    );
                }
            );

            label.appendChild(checkbox);
            label.appendChild(text);

            requiredSkills.appendChild(label);
        }
    );
}

/* =====================================================
   RENDER LEARNING STAGES
   ===================================================== */

function renderStages() {

    const career =
        careerRoadmaps[selectedCareerKey];

    const progress =
        getCareerProgress(selectedCareerKey);

    learningStages.innerHTML = "";

    career.stages.forEach(
        function (stage, index) {

            const card =
                document.createElement("article");

            card.className = "stage-card";

            const completed =
                progress.stages.includes(index);

            if (completed) {
                card.classList.add("completed");
            }

            const topicsHtml =
                stage.topics
                    .map(
                        topic =>
                            `<span>${topic}</span>`
                    )
                    .join("");

            card.innerHTML = `
                <div class="stage-number">
                    ${completed ? "✓" : index + 1}
                </div>

                <div class="stage-content">

                    <h3>${stage.title}</h3>

                    <span class="stage-duration">
                        ${stage.duration}
                    </span>

                    <p>${stage.description}</p>

                    <div class="topic-list">
                        ${topicsHtml}
                    </div>

                    <div class="stage-project">
                        <strong>Practice Project:</strong>
                        ${stage.project}
                    </div>

                </div>

                <button
                    type="button"
                    class="stage-complete-btn">

                    ${
                        completed
                            ? "Completed ✓"
                            : "Mark Complete"
                    }

                </button>
            `;

            const button =
                card.querySelector(
                    ".stage-complete-btn"
                );

            button.addEventListener(
                "click",
                function () {

                    toggleProgressItem(
                        "stages",
                        index,
                        !completed
                    );

                    renderRoadmap();
                }
            );

            learningStages.appendChild(card);
        }
    );
}

/* =====================================================
   RENDER PROJECTS
   ===================================================== */

function renderProjects() {

    const career =
        careerRoadmaps[selectedCareerKey];

    const progress =
        getCareerProgress(selectedCareerKey);

    recommendedProjects.innerHTML = "";

    career.projects.forEach(
        function (project, index) {

            const card =
                document.createElement("article");

            card.className = "project-card";

            const completed =
                progress.projects.includes(index);

            if (completed) {
                card.classList.add("completed");
            }

            const skillsHtml =
                project.skills
                    .map(
                        skill =>
                            `<span>${skill}</span>`
                    )
                    .join("");

            card.innerHTML = `
                <h3>${project.title}</h3>

                <p>${project.description}</p>

                <div class="project-skills">
                    ${skillsHtml}
                </div>

                <button
                    type="button"
                    class="project-complete-btn">

                    ${
                        completed
                            ? "Project Completed ✓"
                            : "Mark Project Complete"
                    }

                </button>
            `;

            const button =
                card.querySelector(
                    ".project-complete-btn"
                );

            button.addEventListener(
                "click",
                function () {

                    toggleProgressItem(
                        "projects",
                        index,
                        !completed
                    );

                    renderRoadmap();
                }
            );

            recommendedProjects.appendChild(card);
        }
    );
}

/* =====================================================
   UPDATE PROGRESS ITEM
   ===================================================== */

function toggleProgressItem(
    category,
    index,
    shouldComplete
) {

    const progress =
        getCareerProgress(selectedCareerKey);

    const items =
        new Set(progress[category] || []);

    if (shouldComplete) {
        items.add(index);
    } else {
        items.delete(index);
    }

    progress[category] =
        Array.from(items);

    saveCareerProgress(
        selectedCareerKey,
        progress
    );

    updateProgressDisplay();
}

/* =====================================================
   UPDATE OVERALL PROGRESS
   ===================================================== */

function updateProgressDisplay() {

    const career =
        careerRoadmaps[selectedCareerKey];

    const progress =
        getCareerProgress(selectedCareerKey);

    const completedSkills =
        progress.skills.length;

    const completedStages =
        progress.stages.length;

    const completedProjects =
        progress.projects.length;

    const totalItems =
        career.skills.length +
        career.stages.length +
        career.projects.length;

    const completedItems =
        completedSkills +
        completedStages +
        completedProjects;

    const percentage =
        totalItems === 0
            ? 0
            : Math.round(
                (completedItems / totalItems) * 100
            );

    overallProgressText.textContent =
        `${percentage}%`;

    overallProgressBar.style.width =
        `${percentage}%`;

    skillCompletionCount.textContent =
        `${completedSkills} / ${career.skills.length} completed`;

    const skillsPercentage =
        career.skills.length === 0
            ? 0
            : Math.round((completedSkills / career.skills.length) * 100);

    const stagesPercentage =
        career.stages.length === 0
            ? 0
            : Math.round((completedStages / career.stages.length) * 100);

    const projectsPercentage =
        career.projects.length === 0
            ? 0
            : Math.round((completedProjects / career.projects.length) * 100);

    localStorage.setItem(
        "careerCompassRoadmapSummary",
        JSON.stringify({
            careerKey: selectedCareerKey,
            careerName: career.name,
            percentage: percentage,
            completedItems: completedItems,
            totalItems: totalItems,
            skillsPercentage: skillsPercentage,
            stagesPercentage: stagesPercentage,
            projectsPercentage: projectsPercentage
        })
    );

    scheduleRoadmapSave();
}

/* =====================================================
   RENDER COMPLETE ROADMAP
   ===================================================== */

function renderRoadmap() {
    renderCareerSummary();
    renderSkills();
    renderStages();
    renderProjects();
    updateProgressDisplay();
}

/* =====================================================
   CAREER SELECTOR
   ===================================================== */

careerSelector.addEventListener(
    "change",
    function () {

        const selectedValue =
            this.value;

        if (!careerRoadmaps[selectedValue]) {
            return;
        }

        selectedCareerKey =
            selectedValue;

        renderRoadmap();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
);

/* =====================================================
   MOBILE NAVIGATION
   ===================================================== */

const menuToggle = $("menuToggle");
const navLinks = $("navLinks");

menuToggle.addEventListener(
    "click",
    function () {

        const isOpen =
            navLinks.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    }
);

/* =====================================================
   INITIALIZE PAGE (WITH ACCOUNT SYNC)
   ===================================================== */

async function initializeRoadmap() {

    let hasCareer = false;

    try {

        const authResponse = await fetch(`${API_BASE_URL}/api/me`, {
            method: "GET",
            credentials: "include"
        });

        const authResult = await authResponse.json();

        if (
            !authResponse.ok ||
            !authResult.authenticated ||
            !authResult.user
        ) {
            window.location.href = "login.html";
            return;
        }

        hasCareer = loadQuizResult();

        const localAllProgress = getAllProgress();
        const localSummary = readStoredJSON("careerCompassRoadmapSummary", null);

        const localHasData =
            Object.keys(localAllProgress).length > 0 ||
            localSummary !== null;

        const serverRoadmap = await loadRoadmapDataFromServer();

        const serverAllProgress =
            serverRoadmap.allProgress &&
            typeof serverRoadmap.allProgress === "object"
                ? serverRoadmap.allProgress
                : {};

        const serverSummary = serverRoadmap.summary || null;

        const serverHasData =
            Object.keys(serverAllProgress).length > 0 ||
            serverSummary !== null;

        if (serverHasData) {

            localStorage.setItem(
                "careerCompassRoadmapProgress",
                JSON.stringify(serverAllProgress)
            );

            if (serverSummary) {
                localStorage.setItem(
                    "careerCompassRoadmapSummary",
                    JSON.stringify(serverSummary)
                );
            }
        }

        roadmapReady = true;

        // Migrate existing browser Roadmap data into the account once.
        if (!serverHasData && localHasData) {
            await saveRoadmapDataToServer();
        }

        if (hasCareer) {
            renderRoadmap();
        }

    } catch (error) {

        console.error("Roadmap initialization failed:", error);

        roadmapReady = true;

        if (hasCareer) {
            renderRoadmap();
        }
    }
}

document.addEventListener(
    "DOMContentLoaded",
    initializeRoadmap
);