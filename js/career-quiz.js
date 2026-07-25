/* =========================================================
   CareerCompass — AI Career Quiz
   ========================================================= */

"use strict";


/* =========================================================
   CAREER INFORMATION
   ========================================================= */

const careerData = {

    frontend: {
        name: "Frontend Developer",
        icon: "🎨",

        description:
            "Frontend developers create responsive and interactive website interfaces using HTML, CSS, JavaScript and modern frontend frameworks.",

        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "Responsive Design",
            "React",
            "Git",
            "APIs",
            "UI/UX Basics"
        ],

        reasons: [
            "You enjoy visual and creative work.",
            "You are interested in website interfaces.",
            "You prefer seeing immediate results from your code.",
            "You value user experience and design."
        ],

        roadmap: [
            {
                title: "Learn Web Fundamentals",
                description:
                    "Master HTML, CSS, semantic structure, forms, Flexbox and CSS Grid."
            },
            {
                title: "Learn JavaScript",
                description:
                    "Study variables, functions, arrays, DOM manipulation, events and APIs."
            },
            {
                title: "Learn a Frontend Framework",
                description:
                    "Start with React and learn components, props, state and routing."
            },
            {
                title: "Build Portfolio Projects",
                description:
                    "Create responsive websites, dashboards and interactive applications."
            }
        ]
    },

    backend: {
        name: "Backend Developer",
        icon: "⚙️",

        description:
            "Backend developers build server-side logic, APIs, authentication systems and databases that power web and mobile applications.",

        skills: [
            "Python or Java",
            "Node.js",
            "Flask or Django",
            "SQL",
            "REST APIs",
            "Authentication",
            "Databases",
            "Git"
        ],

        reasons: [
            "You enjoy logic and problem-solving.",
            "You are interested in how applications work internally.",
            "You prefer data processing over visual design.",
            "You like building reliable systems."
        ],

        roadmap: [
            {
                title: "Choose a Programming Language",
                description:
                    "Learn Python, Java or JavaScript thoroughly."
            },
            {
                title: "Learn Server-Side Development",
                description:
                    "Study Flask, Django, Express or Spring Boot."
            },
            {
                title: "Learn Databases and APIs",
                description:
                    "Practice SQL, database design and REST API development."
            },
            {
                title: "Build Backend Projects",
                description:
                    "Create authentication systems, APIs and database-driven applications."
            }
        ]
    },

    fullstack: {
        name: "Full Stack Developer",
        icon: "🌐",

        description:
            "Full stack developers work on both frontend interfaces and backend systems to build complete web applications.",

        skills: [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Node.js",
            "Express",
            "SQL",
            "MongoDB",
            "Git",
            "REST APIs"
        ],

        reasons: [
            "You want to understand complete applications.",
            "You enjoy both design and programming logic.",
            "You like working on different parts of a project.",
            "You prefer broad technical knowledge."
        ],

        roadmap: [
            {
                title: "Learn Frontend Fundamentals",
                description:
                    "Master HTML, CSS, JavaScript and responsive design."
            },
            {
                title: "Learn Backend Development",
                description:
                    "Study Node.js, Express, Python Flask or another backend framework."
            },
            {
                title: "Learn Databases",
                description:
                    "Practice SQL and MongoDB with complete CRUD applications."
            },
            {
                title: "Build Full Stack Applications",
                description:
                    "Create applications containing frontend, backend, authentication and databases."
            }
        ]
    },

    software: {
        name: "Software Developer",
        icon: "💻",

        description:
            "Software developers design, create, test and maintain applications using programming, algorithms and software-engineering practices.",

        skills: [
            "Programming",
            "Object-Oriented Programming",
            "Data Structures",
            "Algorithms",
            "Debugging",
            "Testing",
            "Git",
            "Problem Solving"
        ],

        reasons: [
            "You enjoy writing structured programs.",
            "You like solving logical problems.",
            "You are interested in building useful applications.",
            "You value reliable and maintainable code."
        ],

        roadmap: [
            {
                title: "Master Programming Fundamentals",
                description:
                    "Choose Python, Java, C++ or JavaScript and study it deeply."
            },
            {
                title: "Learn Data Structures and Algorithms",
                description:
                    "Practice arrays, linked lists, stacks, queues, trees and sorting."
            },
            {
                title: "Study Software Engineering",
                description:
                    "Learn OOP, debugging, testing, Git and clean-code principles."
            },
            {
                title: "Build Software Projects",
                description:
                    "Create desktop, web or mobile applications that solve real problems."
            }
        ]
    },

    aiml: {
        name: "AI/ML Engineer",
        icon: "🤖",

        description:
            "AI/ML engineers develop machine-learning models and intelligent applications using data, algorithms and artificial-intelligence technologies.",

        skills: [
            "Python",
            "NumPy",
            "Pandas",
            "Scikit-learn",
            "Machine Learning",
            "Statistics",
            "Model Evaluation",
            "TensorFlow"
        ],

        reasons: [
            "You are interested in intelligent systems.",
            "You enjoy mathematics and problem-solving.",
            "You want computers to learn from data.",
            "You enjoy experimentation and prediction."
        ],

        roadmap: [
            {
                title: "Learn Python and Mathematics",
                description:
                    "Study Python, statistics, probability and basic linear algebra."
            },
            {
                title: "Learn Data Processing",
                description:
                    "Practice NumPy, Pandas, visualization and data cleaning."
            },
            {
                title: "Learn Machine Learning",
                description:
                    "Study regression, classification, clustering and model evaluation."
            },
            {
                title: "Build AI Projects",
                description:
                    "Create prediction systems, recommendation engines and intelligent applications."
            }
        ]
    },

    analyst: {
        name: "Data Analyst",
        icon: "📊",

        description:
            "Data analysts clean, examine and visualize data to discover patterns and support business decisions.",

        skills: [
            "Excel",
            "SQL",
            "Python",
            "Pandas",
            "Statistics",
            "Power BI",
            "Tableau",
            "Data Visualization"
        ],

        reasons: [
            "You enjoy working with numbers.",
            "You like finding patterns in information.",
            "You want to support decisions with evidence.",
            "You enjoy charts, reports and dashboards."
        ],

        roadmap: [
            {
                title: "Learn Spreadsheet Analysis",
                description:
                    "Practice Excel formulas, data cleaning, pivot tables and charts."
            },
            {
                title: "Learn SQL",
                description:
                    "Study queries, joins, filtering, grouping and database concepts."
            },
            {
                title: "Learn Python and Visualization",
                description:
                    "Use Pandas, Matplotlib, Power BI or Tableau for analysis."
            },
            {
                title: "Build Data Projects",
                description:
                    "Analyze real datasets and create dashboards with actionable findings."
            }
        ]
    },

    scientist: {
        name: "Data Scientist",
        icon: "🔬",

        description:
            "Data scientists combine programming, statistics and machine learning to discover insights and build predictive models.",

        skills: [
            "Python",
            "SQL",
            "Pandas",
            "NumPy",
            "Statistics",
            "Machine Learning",
            "Feature Engineering",
            "Data Visualization"
        ],

        reasons: [
            "You enjoy advanced data analysis.",
            "You are comfortable with mathematics.",
            "You like research and experimentation.",
            "You want to build predictive solutions."
        ],

        roadmap: [
            {
                title: "Strengthen Mathematics",
                description:
                    "Study statistics, probability and linear algebra fundamentals."
            },
            {
                title: "Master Python for Data",
                description:
                    "Learn NumPy, Pandas, SQL and data visualization."
            },
            {
                title: "Study Machine Learning",
                description:
                    "Practice preprocessing, feature engineering and predictive modelling."
            },
            {
                title: "Complete Data Science Projects",
                description:
                    "Work with real datasets and explain your findings clearly."
            }
        ]
    },

    devops: {
        name: "DevOps Engineer",
        icon: "🔄",

        description:
            "DevOps engineers automate software delivery, testing, infrastructure and deployment to make development faster and more reliable.",

        skills: [
            "Linux",
            "Git",
            "Docker",
            "Kubernetes",
            "CI/CD",
            "GitHub Actions",
            "Cloud Platforms",
            "Monitoring"
        ],

        reasons: [
            "You enjoy automation and system efficiency.",
            "You like connecting development with deployment.",
            "You are interested in infrastructure.",
            "You value reliability and continuous improvement."
        ],

        roadmap: [
            {
                title: "Learn Linux and Networking",
                description:
                    "Study command-line tools, permissions, processes and networking basics."
            },
            {
                title: "Learn Git and Automation",
                description:
                    "Practice Git workflows, scripting and CI/CD pipelines."
            },
            {
                title: "Learn Containers",
                description:
                    "Study Docker, Kubernetes and application deployment."
            },
            {
                title: "Build DevOps Projects",
                description:
                    "Automate testing and deployment for complete applications."
            }
        ]
    },

    cloud: {
        name: "Cloud Engineer",
        icon: "☁️",

        description:
            "Cloud engineers design, deploy and maintain scalable infrastructure and applications using platforms such as AWS, Azure and Google Cloud.",

        skills: [
            "AWS",
            "Azure",
            "Google Cloud",
            "Linux",
            "Networking",
            "Docker",
            "Terraform",
            "Cloud Security"
        ],

        reasons: [
            "You are interested in large-scale systems.",
            "You enjoy infrastructure and networking.",
            "You want to deploy applications online.",
            "You value scalability and reliability."
        ],

        roadmap: [
            {
                title: "Learn Networking and Linux",
                description:
                    "Understand operating systems, IP addressing, DNS and network security."
            },
            {
                title: "Choose a Cloud Platform",
                description:
                    "Begin with AWS, Azure or Google Cloud fundamentals."
            },
            {
                title: "Learn Cloud Deployment",
                description:
                    "Practice virtual machines, storage, databases and containers."
            },
            {
                title: "Build Cloud Projects",
                description:
                    "Deploy secure and scalable applications using cloud services."
            }
        ]
    },

    cybersecurity: {
        name: "Cybersecurity Analyst",
        icon: "🛡️",

        description:
            "Cybersecurity analysts protect computer systems and networks by monitoring threats, finding vulnerabilities and responding to incidents.",

        skills: [
            "Network Security",
            "Linux",
            "Wireshark",
            "Nmap",
            "Security Monitoring",
            "Vulnerability Assessment",
            "Incident Response",
            "Risk Analysis"
        ],

        reasons: [
            "You enjoy investigating technical problems.",
            "You are interested in protecting systems.",
            "You pay attention to unusual behaviour.",
            "You value privacy, safety and risk prevention."
        ],

        roadmap: [
            {
                title: "Learn Computer Networks",
                description:
                    "Study TCP/IP, DNS, ports, protocols and network architecture."
            },
            {
                title: "Learn Linux and Security Basics",
                description:
                    "Practice Linux commands, permissions, authentication and encryption."
            },
            {
                title: "Learn Security Tools",
                description:
                    "Use Wireshark, Nmap and vulnerability-assessment tools ethically."
            },
            {
                title: "Build Defensive Security Projects",
                description:
                    "Create security-monitoring, log-analysis and risk-assessment projects."
            }
        ]
    }
};


/* =========================================================
   QUIZ QUESTIONS
   ========================================================= */

const questions = [

    {
        question:
            "Which type of activity interests you the most?",

        options: [
            {
                text: "Designing attractive websites and interfaces",
                scores: {
                    frontend: 3,
                    fullstack: 1
                }
            },
            {
                text: "Building application logic and processing data",
                scores: {
                    backend: 3,
                    software: 2
                }
            },
            {
                text: "Studying data and discovering patterns",
                scores: {
                    analyst: 3,
                    scientist: 2,
                    aiml: 1
                }
            },
            {
                text: "Protecting systems and investigating threats",
                scores: {
                    cybersecurity: 3,
                    cloud: 1
                }
            }
        ]
    },

    {
        question:
            "Which result would make you feel most satisfied?",

        options: [
            {
                text: "A polished interface that users enjoy",
                scores: {
                    frontend: 3,
                    fullstack: 1
                }
            },
            {
                text: "A reliable application that solves a problem",
                scores: {
                    software: 3,
                    backend: 2
                }
            },
            {
                text: "An accurate prediction created from data",
                scores: {
                    aiml: 3,
                    scientist: 3
                }
            },
            {
                text: "A secure and stable online system",
                scores: {
                    cybersecurity: 3,
                    cloud: 2,
                    devops: 2
                }
            }
        ]
    },

    {
        question:
            "Which subject or skill do you enjoy most?",

        options: [
            {
                text: "Art, design and visual communication",
                scores: {
                    frontend: 3
                }
            },
            {
                text: "Programming and logical problem-solving",
                scores: {
                    software: 3,
                    backend: 2,
                    fullstack: 1
                }
            },
            {
                text: "Mathematics, statistics and data",
                scores: {
                    scientist: 3,
                    aiml: 3,
                    analyst: 2
                }
            },
            {
                text: "Computer networks and system security",
                scores: {
                    cybersecurity: 3,
                    cloud: 2,
                    devops: 2
                }
            }
        ]
    },

    {
        question:
            "How do you prefer to solve technical problems?",

        options: [
            {
                text: "Experiment visually until the interface feels right",
                scores: {
                    frontend: 3
                }
            },
            {
                text: "Break the problem into logical programming steps",
                scores: {
                    software: 3,
                    backend: 2
                }
            },
            {
                text: "Study evidence, data and measurable results",
                scores: {
                    analyst: 3,
                    scientist: 2,
                    aiml: 2
                }
            },
            {
                text: "Inspect the complete system and identify weaknesses",
                scores: {
                    cybersecurity: 3,
                    devops: 2,
                    cloud: 1
                }
            }
        ]
    },

    {
        question:
            "Which project sounds most exciting?",

        options: [
            {
                text: "An interactive portfolio website",
                scores: {
                    frontend: 3,
                    fullstack: 1
                }
            },
            {
                text: "A complete online management system",
                scores: {
                    fullstack: 3,
                    backend: 2,
                    software: 2
                }
            },
            {
                text: "A machine-learning prediction application",
                scores: {
                    aiml: 3,
                    scientist: 3
                }
            },
            {
                text: "A network security monitoring system",
                scores: {
                    cybersecurity: 3,
                    devops: 1
                }
            }
        ]
    },

    {
        question:
            "Which working environment would you prefer?",

        options: [
            {
                text: "Working closely with designers and product teams",
                scores: {
                    frontend: 3,
                    fullstack: 1
                }
            },
            {
                text: "Building complex software with developers",
                scores: {
                    software: 3,
                    backend: 2
                }
            },
            {
                text: "Researching data and testing hypotheses",
                scores: {
                    scientist: 3,
                    aiml: 2,
                    analyst: 2
                }
            },
            {
                text: "Managing systems, infrastructure and reliability",
                scores: {
                    devops: 3,
                    cloud: 3,
                    cybersecurity: 1
                }
            }
        ]
    },

    {
        question:
            "How interested are you in visual design?",

        options: [
            {
                text: "Very interested; visual design is important to me",
                scores: {
                    frontend: 3,
                    fullstack: 1
                }
            },
            {
                text: "Moderately interested, but I prefer programming",
                scores: {
                    fullstack: 2,
                    software: 2
                }
            },
            {
                text: "I prefer dashboards and data visualizations",
                scores: {
                    analyst: 3,
                    scientist: 1
                }
            },
            {
                text: "I prefer systems and security over design",
                scores: {
                    cybersecurity: 2,
                    devops: 2,
                    cloud: 2
                }
            }
        ]
    },

    {
        question:
            "Which technical responsibility appeals to you most?",

        options: [
            {
                text: "Creating responsive layouts and animations",
                scores: {
                    frontend: 3
                }
            },
            {
                text: "Developing APIs and database operations",
                scores: {
                    backend: 3,
                    fullstack: 2
                }
            },
            {
                text: "Training and evaluating predictive models",
                scores: {
                    aiml: 3,
                    scientist: 3
                }
            },
            {
                text: "Automating deployment and infrastructure",
                scores: {
                    devops: 3,
                    cloud: 3
                }
            }
        ]
    },

    {
        question:
            "What type of information do you enjoy working with?",

        options: [
            {
                text: "Colours, layouts and user interactions",
                scores: {
                    frontend: 3
                }
            },
            {
                text: "Program objects, functions and application rules",
                scores: {
                    software: 3,
                    backend: 2
                }
            },
            {
                text: "Tables, statistics and large datasets",
                scores: {
                    analyst: 3,
                    scientist: 3,
                    aiml: 1
                }
            },
            {
                text: "Logs, network traffic and system events",
                scores: {
                    cybersecurity: 3,
                    devops: 2
                }
            }
        ]
    },

    {
        question:
            "Which challenge would you choose?",

        options: [
            {
                text: "Make a website work perfectly on every screen",
                scores: {
                    frontend: 3,
                    fullstack: 1
                }
            },
            {
                text: "Improve the performance of a software application",
                scores: {
                    software: 3,
                    backend: 2
                }
            },
            {
                text: "Find why a prediction model is inaccurate",
                scores: {
                    aiml: 3,
                    scientist: 3
                }
            },
            {
                text: "Find and fix a security or server problem",
                scores: {
                    cybersecurity: 3,
                    cloud: 2,
                    devops: 2
                }
            }
        ]
    },

    {
        question:
            "How do you feel about mathematics and statistics?",

        options: [
            {
                text: "I prefer creative work with limited mathematics",
                scores: {
                    frontend: 3
                }
            },
            {
                text: "I am comfortable with the mathematics used in programming",
                scores: {
                    software: 3,
                    backend: 2,
                    fullstack: 1
                }
            },
            {
                text: "I enjoy statistics and mathematical modelling",
                scores: {
                    scientist: 3,
                    aiml: 3,
                    analyst: 2
                }
            },
            {
                text: "I prefer networking, infrastructure and security concepts",
                scores: {
                    cybersecurity: 2,
                    cloud: 2,
                    devops: 2
                }
            }
        ]
    },

    {
        question:
            "What would you most like to automate?",

        options: [
            {
                text: "User-interface behaviour",
                scores: {
                    frontend: 3,
                    fullstack: 1
                }
            },
            {
                text: "Business operations and application logic",
                scores: {
                    backend: 3,
                    software: 2
                }
            },
            {
                text: "Predictions and data-based decisions",
                scores: {
                    aiml: 3,
                    scientist: 3,
                    analyst: 1
                }
            },
            {
                text: "Testing, deployment and infrastructure",
                scores: {
                    devops: 3,
                    cloud: 3
                }
            }
        ]
    },

    {
        question:
            "Which tool would you most like to learn?",

        options: [
            {
                text: "React and advanced CSS",
                scores: {
                    frontend: 3,
                    fullstack: 1
                }
            },
            {
                text: "Python, Java or Node.js",
                scores: {
                    software: 3,
                    backend: 3,
                    fullstack: 1
                }
            },
            {
                text: "Pandas, Scikit-learn and TensorFlow",
                scores: {
                    aiml: 3,
                    scientist: 3,
                    analyst: 1
                }
            },
            {
                text: "Linux, Docker, AWS and security tools",
                scores: {
                    devops: 3,
                    cloud: 3,
                    cybersecurity: 2
                }
            }
        ]
    },

    {
        question:
            "Which responsibility best matches your personality?",

        options: [
            {
                text: "Creating clear and enjoyable user experiences",
                scores: {
                    frontend: 3
                }
            },
            {
                text: "Designing structured and dependable software",
                scores: {
                    software: 3,
                    backend: 2,
                    fullstack: 2
                }
            },
            {
                text: "Turning complex data into useful knowledge",
                scores: {
                    analyst: 3,
                    scientist: 3,
                    aiml: 2
                }
            },
            {
                text: "Keeping systems secure, available and stable",
                scores: {
                    cybersecurity: 3,
                    devops: 3,
                    cloud: 3
                }
            }
        ]
    },

    {
        question:
            "What is your preferred long-term career impact?",

        options: [
            {
                text: "Build digital products used directly by people",
                scores: {
                    frontend: 3,
                    fullstack: 2
                }
            },
            {
                text: "Create powerful and reliable software systems",
                scores: {
                    software: 3,
                    backend: 3
                }
            },
            {
                text: "Use data and AI to solve difficult problems",
                scores: {
                    aiml: 3,
                    scientist: 3,
                    analyst: 2
                }
            },
            {
                text: "Protect and operate important digital infrastructure",
                scores: {
                    cybersecurity: 3,
                    cloud: 3,
                    devops: 3
                }
            }
        ]
    }
];


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const quizIntro =
    document.getElementById("quizIntro");

const quizSection =
    document.getElementById("quizSection");

const resultsSection =
    document.getElementById("resultsSection");

const startQuizBtn =
    document.getElementById("startQuizBtn");

const questionProgress =
    document.getElementById("questionProgress");

const progressPercentage =
    document.getElementById("progressPercentage");

const progressFill =
    document.getElementById("progressFill");

const questionText =
    document.getElementById("questionText");

const optionsContainer =
    document.getElementById("optionsContainer");

const previousBtn =
    document.getElementById("previousBtn");

const nextBtn =
    document.getElementById("nextBtn");

const primaryCareerIcon =
    document.getElementById("primaryCareerIcon");

const primaryCareerName =
    document.getElementById("primaryCareerName");

const primaryMatchScore =
    document.getElementById("primaryMatchScore");

const primaryMatchBar =
    document.getElementById("primaryMatchBar");

const primaryCareerDescription =
    document.getElementById("primaryCareerDescription");

const secondaryResults =
    document.getElementById("secondaryResults");

const recommendedSkills =
    document.getElementById("recommendedSkills");

const careerReasons =
    document.getElementById("careerReasons");

const careerRoadmap =
    document.getElementById("careerRoadmap");

const retakeQuizBtn =
    document.getElementById("retakeQuizBtn");

const downloadQuizReportBtn =
    document.getElementById("downloadQuizReportBtn");

const navToggle =
    document.getElementById("navToggle");

const siteNav =
    document.getElementById("siteNav");


/* =========================================================
   QUIZ STATE
   ========================================================= */

let currentQuestionIndex = 0;

let answers =
    new Array(questions.length).fill(null);

let finalCareerResults = [];


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

navToggle.addEventListener("click", function () {

    const isOpen =
        siteNav.classList.toggle("open");

    navToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );
});


/* =========================================================
   START QUIZ
   ========================================================= */

startQuizBtn.addEventListener("click", function () {

    quizIntro.classList.add("hidden");

    resultsSection.classList.add("hidden");

    quizSection.classList.remove("hidden");

    currentQuestionIndex = 0;

    displayQuestion();

    quizSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});


/* =========================================================
   DISPLAY QUESTION
   ========================================================= */

function displayQuestion() {

    const currentQuestion =
        questions[currentQuestionIndex];

    const questionNumber =
        currentQuestionIndex + 1;

    const progress =
        Math.round(
            (questionNumber / questions.length) * 100
        );

    questionProgress.textContent =
        `Question ${questionNumber} of ${questions.length}`;

    progressPercentage.textContent =
        `${progress}%`;

    progressFill.style.width =
        `${progress}%`;

    questionText.textContent =
        currentQuestion.question;

    optionsContainer.innerHTML = "";

    currentQuestion.options.forEach(
        function (option, optionIndex) {

            const optionButton =
                document.createElement("button");

            optionButton.type = "button";

            optionButton.className =
                "option-card";

            optionButton.innerHTML = `
                <span class="option-letter">
                    ${String.fromCharCode(65 + optionIndex)}
                </span>

                <span class="option-text">
                    ${option.text}
                </span>
            `;

            if (
                answers[currentQuestionIndex] ===
                optionIndex
            ) {
                optionButton.classList.add(
                    "selected"
                );
            }

            optionButton.addEventListener(
                "click",
                function () {

                    selectOption(optionIndex);
                }
            );

            optionsContainer.appendChild(
                optionButton
            );
        }
    );

    previousBtn.disabled =
        currentQuestionIndex === 0;

    nextBtn.disabled =
        answers[currentQuestionIndex] === null;

    if (
        currentQuestionIndex ===
        questions.length - 1
    ) {
        nextBtn.textContent =
            "View Career Results";
    } else {
        nextBtn.textContent =
            "Next Question";
    }
}


/* =========================================================
   SELECT OPTION
   ========================================================= */

function selectOption(optionIndex) {

    answers[currentQuestionIndex] =
        optionIndex;

    const optionCards =
        optionsContainer.querySelectorAll(
            ".option-card"
        );

    optionCards.forEach(
        function (card, index) {

            card.classList.toggle(
                "selected",
                index === optionIndex
            );
        }
    );

    nextBtn.disabled = false;
}


/* =========================================================
   PREVIOUS AND NEXT
   ========================================================= */

previousBtn.addEventListener("click", function () {

    if (currentQuestionIndex > 0) {

        currentQuestionIndex--;

        displayQuestion();
    }
});


nextBtn.addEventListener("click", function () {

    if (
        answers[currentQuestionIndex] === null
    ) {
        return;
    }

    if (
        currentQuestionIndex <
        questions.length - 1
    ) {

        currentQuestionIndex++;

        displayQuestion();

        return;
    }

    calculateResults();
});


/* =========================================================
   CALCULATE MAXIMUM POSSIBLE SCORES
   ========================================================= */

function calculateMaximumScores() {

    const maximumScores = {};

    Object.keys(careerData).forEach(
        function (careerKey) {

            maximumScores[careerKey] = 0;
        }
    );

    questions.forEach(function (question) {

        Object.keys(careerData).forEach(
            function (careerKey) {

                const highestWeight =
                    Math.max(
                        ...question.options.map(
                            function (option) {

                                return (
                                    option.scores[
                                        careerKey
                                    ] || 0
                                );
                            }
                        )
                    );

                maximumScores[careerKey] +=
                    highestWeight;
            }
        );
    });

    return maximumScores;
}


/* =========================================================
   CALCULATE RESULTS
   ========================================================= */

function calculateResults() {

    const scores = {};

    Object.keys(careerData).forEach(
        function (careerKey) {

            scores[careerKey] = 0;
        }
    );

    answers.forEach(
        function (answerIndex, questionIndex) {

            const selectedOption =
                questions[questionIndex]
                    .options[answerIndex];

            Object.entries(
                selectedOption.scores
            ).forEach(
                function ([careerKey, value]) {

                    scores[careerKey] += value;
                }
            );
        }
    );

    const maximumScores =
        calculateMaximumScores();

    finalCareerResults =
        Object.keys(careerData)
            .map(function (careerKey) {

                const rawScore =
                    scores[careerKey];

                const maximum =
                    maximumScores[careerKey];

                const percentage =
                    maximum > 0
                        ? Math.round(
                            (rawScore / maximum) *
                            100
                        )
                        : 0;

                return {
                    key: careerKey,
                    rawScore: rawScore,
                    percentage:
                        Math.min(
                            100,
                            percentage
                        ),
                    ...careerData[careerKey]
                };
            })
            .sort(function (a, b) {

                if (
                    b.percentage ===
                    a.percentage
                ) {
                    return (
                        b.rawScore -
                        a.rawScore
                    );
                }

                return (
                    b.percentage -
                    a.percentage
                );
            });

    showResults();
}


/* =========================================================
   DISPLAY RESULTS
   ========================================================= */

function showResults() {

    quizSection.classList.add("hidden");

    resultsSection.classList.remove("hidden");

    const topThree =
        finalCareerResults.slice(0, 3);

    const primaryCareer =
        topThree[0];

        localStorage.setItem(
    "careerCompassCareerResult",
    JSON.stringify({
        primaryCareer: {
            key: primaryCareer.key,
            name: primaryCareer.name,
            percentage: primaryCareer.percentage,
            description: primaryCareer.description,
            skills: primaryCareer.skills,
            roadmap: primaryCareer.roadmap
        },

        topThree: topThree.map(function (career) {
            return {
                key: career.key,
                name: career.name,
                percentage: career.percentage
            };
        })
    })
);

    primaryCareerIcon.textContent =
        primaryCareer.icon;

    primaryCareerName.textContent =
        primaryCareer.name;

    primaryMatchScore.textContent =
        `${primaryCareer.percentage}%`;

    primaryCareerDescription.textContent =
        primaryCareer.description;

    primaryMatchBar.style.width = "0%";

    setTimeout(function () {

        primaryMatchBar.style.width =
            `${primaryCareer.percentage}%`;

    }, 150);


    renderSecondaryResults(
        topThree.slice(1)
    );

    renderSkills(primaryCareer.skills);

    renderReasons(primaryCareer.reasons);

    renderRoadmap(primaryCareer.roadmap);

    resultsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


/* =========================================================
   SECONDARY CAREER RESULTS
   ========================================================= */

function renderSecondaryResults(careers) {

    secondaryResults.innerHTML =
        careers
            .map(function (career) {

                return `
                    <article class="secondary-career-card">

                        <div class="secondary-career-header">

                            <div class="secondary-career-icon">
                                ${career.icon}
                            </div>

                            <h4>
                                ${career.name}
                            </h4>

                            <strong>
                                ${career.percentage}%
                            </strong>

                        </div>

                        <p>
                            ${career.description}
                        </p>

                        <div class="secondary-match-bar">

                            <div style="width:
                                ${career.percentage}%">
                            </div>

                        </div>

                    </article>
                `;
            })
            .join("");
}


/* =========================================================
   RECOMMENDED SKILLS
   ========================================================= */

function renderSkills(skills) {

    recommendedSkills.innerHTML =
        skills
            .map(function (skill) {

                return `
                    <span class="skill-chip">
                        ${skill}
                    </span>
                `;
            })
            .join("");
}


/* =========================================================
   CAREER REASONS
   ========================================================= */

function renderReasons(reasons) {

    careerReasons.innerHTML =
        reasons
            .map(function (reason) {

                return `
                    <li>
                        ${reason}
                    </li>
                `;
            })
            .join("");
}


/* =========================================================
   CAREER ROADMAP
   ========================================================= */

function renderRoadmap(roadmap) {

    careerRoadmap.innerHTML =
        roadmap
            .map(
                function (step, index) {

                    return `
                        <article class="roadmap-step">

                            <div class="roadmap-number">
                                ${index + 1}
                            </div>

                            <div class="roadmap-content">

                                <h4>
                                    ${step.title}
                                </h4>

                                <p>
                                    ${step.description}
                                </p>

                            </div>

                        </article>
                    `;
                }
            )
            .join("");
}


/* =========================================================
   RETAKE QUIZ
   ========================================================= */

retakeQuizBtn.addEventListener(
    "click",
    function () {

        currentQuestionIndex = 0;

        answers =
            new Array(
                questions.length
            ).fill(null);

        finalCareerResults = [];

        resultsSection.classList.add(
            "hidden"
        );

        quizIntro.classList.remove(
            "hidden"
        );

        primaryMatchBar.style.width =
            "0%";

        quizIntro.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
);


/* =========================================================
   DOWNLOAD CAREER REPORT
   ========================================================= */

downloadQuizReportBtn.addEventListener(
    "click",
    function () {

        if (
            !finalCareerResults.length
        ) {
            alert(
                "Complete the quiz before downloading the report."
            );

            return;
        }

        if (!window.jspdf) {

            alert(
                "The PDF library could not load. Refresh the page and try again."
            );

            return;
        }

        const { jsPDF } =
            window.jspdf;

        const pdf =
            new jsPDF(
                "p",
                "mm",
                "a4"
            );

        const pageWidth = 210;
        const pageHeight = 297;

        const leftMargin = 18;
        const rightMargin = 18;

        const contentWidth =
            pageWidth -
            leftMargin -
            rightMargin;

        let y = 20;


        function checkPage(
            requiredSpace = 15
        ) {

            if (
                y + requiredSpace >
                pageHeight - 18
            ) {
                pdf.addPage();

                y = 20;
            }
        }


        function addSectionTitle(title) {

            checkPage(18);

            y += 5;

            pdf.setFont(
                "helvetica",
                "bold"
            );

            pdf.setFontSize(14);

            pdf.setTextColor(
                37,
                99,
                235
            );

            pdf.text(
                title,
                leftMargin,
                y
            );

            y += 3;

            pdf.setDrawColor(
                190,
                205,
                225
            );

            pdf.line(
                leftMargin,
                y,
                pageWidth -
                rightMargin,
                y
            );

            y += 8;
        }


        function addText(
            text,
            options = {}
        ) {

            if (!text) {
                return;
            }

            const {
                bold = false,
                size = 10,
                gap = 3
            } = options;

            pdf.setFont(
                "helvetica",
                bold
                    ? "bold"
                    : "normal"
            );

            pdf.setFontSize(size);

            pdf.setTextColor(
                30,
                41,
                59
            );

            const lines =
                pdf.splitTextToSize(
                    text,
                    contentWidth
                );

            checkPage(
                lines.length * 5 +
                gap
            );

            pdf.text(
                lines,
                leftMargin,
                y
            );

            y +=
                lines.length * 5 +
                gap;
        }


        const topThree =
            finalCareerResults.slice(
                0,
                3
            );

        const primaryCareer =
            topThree[0];


        /* Header */

        pdf.setFont(
            "helvetica",
            "bold"
        );

        pdf.setFontSize(21);

        pdf.setTextColor(
            30,
            58,
            138
        );

        pdf.text(
            "CareerCompass Career Quiz Report",
            leftMargin,
            y
        );

        y += 9;

        pdf.setFont(
            "helvetica",
            "normal"
        );

        pdf.setFontSize(10);

        pdf.setTextColor(
            100,
            116,
            139
        );

        pdf.text(
            "Estimated career recommendations based on quiz responses",
            leftMargin,
            y
        );

        y += 7;

        pdf.setDrawColor(
            37,
            99,
            235
        );

        pdf.line(
            leftMargin,
            y,
            pageWidth -
            rightMargin,
            y
        );


        /* Primary result */

        addSectionTitle(
            "Top Career Recommendation"
        );

        addText(
            `${primaryCareer.name} — ${primaryCareer.percentage}% Match`,
            {
                bold: true,
                size: 13,
                gap: 5
            }
        );

        addText(
            primaryCareer.description
        );


        /* Other matches */

        addSectionTitle(
            "Other Strong Career Matches"
        );

        topThree
            .slice(1)
            .forEach(
                function (
                    career,
                    index
                ) {

                    addText(
                        `${index + 2}. ${career.name} — ${career.percentage}% Match`,
                        {
                            bold: true,
                            size: 11
                        }
                    );
                }
            );


        /* Skills */

        addSectionTitle(
            "Recommended Skills"
        );

        primaryCareer.skills.forEach(
            function (skill) {

                addText(
                    `• ${skill}`,
                    {
                        gap: 1
                    }
                );
            }
        );


        /* Reasons */

        addSectionTitle(
            "Why This Career Fits"
        );

        primaryCareer.reasons.forEach(
            function (reason) {

                addText(
                    `• ${reason}`,
                    {
                        gap: 2
                    }
                );
            }
        );


        /* Roadmap */

        addSectionTitle(
            "Career Roadmap"
        );

        primaryCareer.roadmap.forEach(
            function (step, index) {

                addText(
                    `${index + 1}. ${step.title}`,
                    {
                        bold: true,
                        size: 11,
                        gap: 2
                    }
                );

                addText(
                    step.description,
                    {
                        gap: 5
                    }
                );
            }
        );


        /* Disclaimer */

        addSectionTitle(
            "Important Note"
        );

        addText(
            "This is an estimated career recommendation based on quiz responses. It is intended for guidance and should not be treated as a final career decision."
        );


        pdf.save(
            "CareerCompass_Career_Quiz_Report.pdf"
        );
    }
);