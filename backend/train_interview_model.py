"""
train_interview_model.py — trains a real RandomForestRegressor to predict
an interview answer's score (0-100) from the same signals heuristicGrade()
already computes. Saves interview_score_model.pkl + interview_score_features.pkl.

Run:
    python train_interview_model.py
"""

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

FEATURES = ["coverage", "length_score", "structure_score", "hedge_count", "word_count_norm"]

import os
DATASET_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "datasets", "interview_scores.csv")
df = pd.read_csv(DATASET_FILE)
X = df[FEATURES]
y = df["score"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(
    n_estimators=300,
    max_depth=10,
    min_samples_leaf=3,
    random_state=42,
    n_jobs=-1
)
model.fit(X_train, y_train)

preds = model.predict(X_test)
mae = mean_absolute_error(y_test, preds)
r2 = r2_score(y_test, preds)

print(f"Mean Absolute Error: {mae:.2f} points")
print(f"R^2 score: {r2:.4f}")

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")
os.makedirs(MODEL_DIR, exist_ok=True)
joblib.dump(model, os.path.join(MODEL_DIR, "interview_score_model.pkl"))
joblib.dump(FEATURES, os.path.join(MODEL_DIR, "interview_score_features.pkl"))
print("Saved interview_score_model.pkl and interview_score_features.pkl")