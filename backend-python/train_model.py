import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# ============================================================
# Load dataset
# ============================================================
df = pd.read_csv("student_placement_prediction_dataset_2026.csv")

# ============================================================
# Encode target
# ============================================================
target_encoder = LabelEncoder()
df["placement_status_encoded"] = target_encoder.fit_transform(df["placement_status"])

print("Target classes:", dict(zip(
    target_encoder.classes_,
    target_encoder.transform(target_encoder.classes_)
)))
# ^ IMPORTANT: check this printout. The rest of the pipeline assumes
# 1 == "Placed". If it prints the opposite, flip the index used for
# placement_probability in assessment_routes.py.

# ============================================================
# Bucket continuous skill scores into 3 levels (Beginner/Intermediate/
# Advanced). This matters: the assessment form can only ever collect a
# self-rated level from a student, never a precise 0-100 score, so
# train-time and inference-time features MUST live on the same scale.
# ============================================================
def bucket_to_level(series):
    try:
        levels, bins = pd.qcut(series, q=3, labels=[1, 2, 3], retbins=True, duplicates="drop")
        return levels.astype(int), bins.tolist()
    except ValueError:
        lo, hi = series.min(), series.max()
        third = (hi - lo) / 3
        bins = [lo, lo + third, lo + 2 * third, hi]
        levels = pd.cut(series, bins=bins, labels=[1, 2, 3], include_lowest=True).astype(int)
        return levels, bins

df["coding_level"], coding_bins = bucket_to_level(df["coding_skill_score"])
df["communication_level"], communication_bins = bucket_to_level(df["communication_skill_score"])
df["logical_level"], logical_bins = bucket_to_level(df["logical_reasoning_score"])

with open("skill_score_bins.json", "w") as f:
    json.dump({
        "coding_skill_score": coding_bins,
        "communication_skill_score": communication_bins,
        "logical_reasoning_score": logical_bins,
        "note": "1=Beginner range, 2=Intermediate range, 3=Advanced range"
    }, f, indent=2)

# ============================================================
# Feature set — ONLY fields the assessment form can actually provide.
# No invented columns, no zero-filled placeholders.
# ============================================================
FEATURE_COLUMNS = [
    "cgpa",
    "coding_level",
    "communication_level",
    "logical_level",
    "projects_count",
    "github_repos",
    "study_hours_per_day",
]

X = df[FEATURE_COLUMNS]
y = df["placement_status_encoded"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=8,
    min_samples_leaf=5,
    random_state=42,
    class_weight="balanced"
)
model.fit(X_train, y_train)

predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print("Accuracy:", accuracy)
print(classification_report(y_test, predictions, target_names=target_encoder.classes_))

print("\nFeature importance:")
for name, importance in sorted(zip(FEATURE_COLUMNS, model.feature_importances_), key=lambda x: -x[1]):
    print(f"  {name}: {importance:.3f}")

joblib.dump(model, "placement_model.pkl")
joblib.dump(FEATURE_COLUMNS, "placement_model_features.pkl")

print("\nModel saved successfully!")