I am collaborating with Jaishmeet Kaur on a project called CareerCompass.

PROJECT OVERVIEW

CareerCompass is an AI-powered career development platform.

Main goal:
"One platform to plan, build, track, and launch your career."

The platform helps students and developers:
- analyze career readiness
- analyze GitHub portfolios
- identify skill gaps
- improve resumes
- generate career roadmaps
- track learning progress
- prepare for internships
- receive AI career recommendations
- prepare for interviews

TECH STACK

Frontend:
- HTML
- CSS
- JavaScript

Libraries:
- Chart.js
- Font Awesome
- html2canvas
- jsPDF

Future backend:
- Python
- Flask or FastAPI

Future ML:
- Pandas
- NumPy
- Scikit-learn
- Joblib

PROJECT STRUCTURE

CareerCompass/
│
├── pages/
│   ├── dashboard.html
│   ├── github.html
│   ├── assessment.html
│   ├── resume.html
│   └── other platform pages
│
├── css/
│   ├── dashboard.css
│   ├── github.css
│   └── other CSS files
│
├── js/
│   ├── dashboard.js
│   ├── github.js
│   └── other JavaScript files
│
└── assets/

GITHUB ANALYZER

The GitHub Analyzer currently:
- accepts a GitHub username
- fetches GitHub API data
- displays profile information
- displays repository statistics
- calculates a professional score
- displays a circular progress score
- analyzes language distribution using Chart.js
- detects the best repository
- detects the weakest repository
- generates repository cards
- calculates repository scores
- generates repository AI-style analysis
- generates recruiter reviews
- generates an AI career report
- detects skills
- recommends missing skills
- generates career readiness indicators
- generates a portfolio health dashboard
- generates GitHub activity analytics

Portfolio Health metrics:
- Documentation
- Deployment
- Code Quality
- Community
- Project Diversity

GitHub Activity Analytics:
- most recently active repository
- latest repository update
- primary programming language
- activity score

IMPORTANT:
Current AI recommendations are mostly rule-based JavaScript logic.
They are not yet real trained machine learning predictions.

PLANNED MACHINE LEARNING

We plan to build approximately four main ML models:

1. Career Recommendation
Algorithm:
Random Forest Classifier

Possible outputs:
- Frontend Developer
- Backend Developer
- Full Stack Developer
- AI/ML Engineer
- Data Analyst
- DevOps Engineer

2. Hire Probability
Algorithm:
Random Forest Regressor

Input features may include:
- repository count
- followers
- stars
- forks
- language diversity
- deployed projects
- repository quality

3. Repository Quality Prediction
Algorithm:
Random Forest Regressor

Features:
- README
- description
- stars
- forks
- deployment
- license
- topics

4. Skill Gap Detection
Algorithm:
Decision Tree or Random Forest

Input:
- detected skills
- predicted or selected career

Output:
- missing skills
- recommended skills
- next career step

DASHBOARD

The dashboard currently contains:
- sidebar navigation
- placement readiness
- resume score
- GitHub health
- today's goals
- weekly progress Chart.js chart
- upcoming goals
- today's tasks
- recent activity
- skill progress
- AI career recommendations
- upcoming deadlines
- notifications

Recent dashboard Phase 3 work includes:
- dark mode
- loading skeleton
- animated counters
- PDF report export
- share functionality
- confetti animation
- UI animations

The dashboard currently contains some hardcoded demo data.
Later it must be connected with real user data and CareerCompass modules.

COLLABORATION

Jaishmeet is currently mainly working on the GitHub Analyzer and project integration.

I am currently working on the Interview Preparation module.

We work in the same GitHub repository using separate feature branches and Pull Requests.

MY CURRENT RESPONSIBILITY

Help me design and build the Interview Preparation module of CareerCompass.

The Interview Preparation module must not be a simple static interview question website.

It should fit the CareerCompass AI career platform.

Possible features include:
- role-based interview preparation
- personalized questions based on GitHub skills
- technical interview questions
- HR interview questions
- behavioral questions
- mock interview sessions
- answer evaluation
- interview score
- strengths and weaknesses detection
- communication feedback
- recommended improvement areas
- interview history
- interview readiness score

IMPORTANT WORKING STYLE

Work with me step by step.

Do not give the entire project code at once unless I explicitly request it.

Before suggesting a feature:
1. Check whether it fits CareerCompass.
2. Explain what the feature does.
3. Explain why it adds value.
4. Explain whether it uses normal JavaScript, an API, AI, NLP, or machine learning.
5. Clearly state if a feature is rule-based rather than calling it AI.
6. Consider integration with GitHub Analyzer, Resume Builder, Career Assessment, and Dashboard.

When giving code:
- tell me the exact file
- tell me the exact position where code should be placed
- give complete code for that step
- explain important code
- tell me the expected output
- tell me how to test it
- help debug console errors from the exact error message

Do not redesign existing modules without explaining integration impact.

My immediate task is the Interview Preparation module.

First analyze CareerCompass and create a practical phased roadmap for building an innovative Interview Preparation module.