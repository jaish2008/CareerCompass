import os
import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    classification_report,
    confusion_matrix
)
from sklearn.utils import resample


# ==========================================
# File Paths
# ==========================================

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

DATASET_FILE = os.path.join(
    BASE_DIR,
    "datasets",
    "career_dataset.csv"
)

MODEL_FILE = os.path.join(
    BASE_DIR,
    "models",
    "career_model_v4.pkl"
)

FEATURE_FILE = os.path.join(
    BASE_DIR,
    "models",
    "career_features_v4.pkl"
)


# ==========================================
# Load CareerCompass Dataset
# ==========================================

print("Loading CareerCompass dataset...")

df = pd.read_csv(DATASET_FILE)

print("Dataset shape:", df.shape)


# ==========================================
# Define ML Features
# ==========================================

features = [
    "html_css",
    "javascript",
    "typescript",
    "python",
    "java",
    "sql",
    "csharp",
    "cpp",
    "php",
    "go",
    "rust",
    "r_language",

    "react",
    "angular",
    "vue",
    "nodejs",
    "express",
    "django",
    "flask",
    "spring_boot",
    "aspnet",

    "mysql",
    "postgresql",
    "mongodb",
    "sqlite",
    "redis",
    "microsoft_sql_server",

    "docker",
    "aws",
    "azure",
    "gcp",
    "kubernetes",
    "terraform",

    "language_count",
    "framework_count",
    "database_count",
    "platform_count"
]


# ==========================================
# Separate Features and Target
# ==========================================

X = df[features]

y = df["career"]


# ==========================================
# Train-Test Split  Before Balancing
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


# ==========================================
# Balance Training Data Only
# ==========================================

training_df = X_train.copy()

training_df["career"] = y_train.values

balanced_groups = []

class_sample_limits = {
    "Full Stack Developer": 5000,
    "Backend Developer": 4000,
    "Frontend Developer": 1579,
    "DevOps Engineer": 1195,
    "AI/ML Engineer": 459,
    "Data Analyst": 281
}

for career_name, group in training_df.groupby("career"):

    sample_limit = class_sample_limits.get(
        career_name,
        len(group)
    )

    if len(group) > sample_limit:

        balanced_group = resample(
            group,
            replace=False,
            n_samples=sample_limit,
            random_state=42
        )

    else:

        balanced_group = group

    balanced_groups.append(
        balanced_group
    )


balanced_training_df = pd.concat(
    balanced_groups
)

balanced_training_df = balanced_training_df.sample(
    frac=1,
    random_state=42
).reset_index(drop=True)


X_train = balanced_training_df[features]

y_train = balanced_training_df["career"]


print("\nBalanced training distribution:")

print(
    y_train.value_counts()
)

print("\nTraining rows:", len(X_train))

print("Testing rows:", len(X_test))


# ==========================================
# Verify Model Version
# ==========================================

print("\nModel Version : V4")

print("Model File :", MODEL_FILE)

print("Feature File :", FEATURE_FILE)



# ==========================================
# Create Random Forest Model
# ==========================================

model = RandomForestClassifier(
    n_estimators=450,
    max_depth=20,
    min_samples_split=8,
    min_samples_leaf=4,
    max_features="sqrt",
    random_state=42,
    class_weight="balanced_subsample",
    n_jobs=-1
)

print("\nModel Parameters:")

print(model.get_params())


# ==========================================
# Train Model
# ==========================================

print("\nTraining Random Forest model...")

model.fit(
    X_train,
    y_train
)

print("Model training completed.")


# ==========================================
# Make Test Predictions
# ==========================================

predictions = model.predict(X_test)


# ==========================================
# Model Evaluation
# ==========================================

accuracy = accuracy_score(
    y_test,
    predictions
)

macro_f1 = f1_score(
    y_test,
    predictions,
    average="macro"
)

print("\n==============================")
print("MODEL EVALUATION")
print("==============================")

print(
    f"\nAccuracy: {accuracy:.4f}"
)

print(
    f"Macro F1 Score: {macro_f1:.4f}"
)


# ==========================================
# Classification Report
# ==========================================

print("\nClassification Report:\n")

print(
    classification_report(
        y_test,
        predictions,
        zero_division=0
    )
)


# ==========================================
# Confusion Matrix
# ==========================================

print("Confusion Matrix:\n")

print(
    confusion_matrix(
        y_test,
        predictions,
        labels=model.classes_
    )
)

print(
    "\nClass order:"
)

print(
    model.classes_
)


# ==========================================
# Feature Importance
# ==========================================

importance_df = pd.DataFrame({
    "feature": features,
    "importance": model.feature_importances_
})

importance_df = importance_df.sort_values(
    by="importance",
    ascending=False
)

print("\nFeature Importance:\n")

print(
    importance_df.to_string(
        index=False
    )
)


# ==========================================
# Save Trained Model
# ==========================================

os.makedirs(
    os.path.dirname(MODEL_FILE),
    exist_ok=True
)

joblib.dump(
    model,
    MODEL_FILE
)

joblib.dump(
    features,
    FEATURE_FILE
)

print("\nModel saved successfully:")

print(MODEL_FILE)

print("\nFeature schema saved successfully:")

print(FEATURE_FILE)