# CareerCompass

**CareerCompass** is an AI-powered career guidance and placement preparation platform built to help students, fresh graduates, and job seekers plan and manage their career development.

It brings essential career preparation tools together in one place, helping users assess their skills, explore learning paths, prepare for interviews, analyze their resumes, and track internship opportunities.

The goal is to make career planning more structured, accessible, and personalized.

## Features

- AI-powered career recommendations
- Resume analysis and scoring
- GitHub profile analysis
- Technical and aptitude quizzes
- Mock interview preparation
- Personalized learning roadmap
- Internship tracker
- User authentication
- Dashboard with progress tracking

## Technologies Used

### Frontend
- HTML
- CSS
- JavaScript
- Chart.js
- Font Awesome

### Backend
- Python
- Flask
- SQLAlchemy

### AI and Machine Learning
- Groq API
- Scikit-learn
- Pandas
- NumPy

### Additional Tools
- jsPDF

## Project Structure

```text
CareerCompass/
│
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── extensions.py
│   ├── ai_routes.py
│   ├── internship_routes.py
│   ├── predict_routes.py
│   ├── score_routes.py
│   ├── gemini_service.py
│   ├── adzuna_integration.py
│   ├── requirements.txt
│   └── runtime.txt
│
├── css/
├── datasets/
├── docs/
├── js/
├── models/
├── pages/
│
├── .gitignore
├── requirements.txt
├── index.html
└── README.md
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/jaish2008/CareerCompass.git
```

### 2. Navigate to the project folder

```bash
cd CareerCompass
```

### 3. Install dependencies

pip install -r backend/requirements.txt
pip install -r requirements.txt

### 4. Configure environment variables

Create a `.env` file in the project root and add:

```env
SECRET_KEY=your_secret_key_here
```

Replace the placeholder with a secure secret key. Keep your `.env` file private and never commit it to GitHub.

### 5. Start the application

```bash
python backend/app.py
```

The Flask application runs locally on port 5000.

## Contributors

- Kiranpreet Kaur
-  Jaish

## 🌐 Live Demo

[Visit CareerCompass](https://careercompass-preview.onrender.com)


## License

This project is developed for educational purposes.

