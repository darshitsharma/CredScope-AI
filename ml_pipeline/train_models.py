import os
import json
import joblib
import xgboost as xgb
from sklearn.pipeline import Pipeline

from config import (
    MODEL_SCORE_PATH, MODEL_ELIGIBLE_PATH, MODEL_LIMIT_PATH,
    PREPROCESSOR_PATH, FEATURE_NAMES_PATH, METRICS_PATH,
    RANDOM_STATE, N_ESTIMATORS
)
from data_processing import load_data, prepare_datasets, get_preprocessor
from evaluate import evaluate_regression, evaluate_classification

def train_and_export_models():
    print("Loading data...")
    df = load_data()
    
    print("Preparing datasets and applying interaction features...")
    (X_train, X_test, 
     y_score_train, y_score_test, 
     y_eligible_train, y_eligible_test, 
     y_limit_train, y_limit_test) = prepare_datasets(df)
    
    preprocessor = get_preprocessor(X_train)
    
    # Fit preprocessor to get feature count (p) for Adjusted R2
    preprocessor.fit(X_train)
    p = len(preprocessor.get_feature_names_out())
    n_test = len(X_test)
    
    metrics = {}
    
    # 1. Financial Health Score (Regression)
    print("Training Financial Health Score Model...")
    pipeline_score = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', xgb.XGBRegressor(n_estimators=N_ESTIMATORS, random_state=RANDOM_STATE))
    ])
    pipeline_score.fit(X_train, y_score_train)
    metrics["Financial_Health_Score"] = evaluate_regression(pipeline_score, X_test, y_score_test, n_test, p)
    joblib.dump(pipeline_score, MODEL_SCORE_PATH)

    # 2. Credit Eligibility (Classification)
    print("Training Credit Eligibility Model...")
    pipeline_eligible = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', xgb.XGBClassifier(n_estimators=N_ESTIMATORS, random_state=RANDOM_STATE))
    ])
    pipeline_eligible.fit(X_train, y_eligible_train)
    metrics["Credit_Eligible"] = evaluate_classification(pipeline_eligible, X_test, y_eligible_test)
    joblib.dump(pipeline_eligible, MODEL_ELIGIBLE_PATH)
    
    # 3. Recommended Credit Limit (Regression)
    print("Training Recommended Credit Limit Model...")
    pipeline_limit = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('model', xgb.XGBRegressor(n_estimators=N_ESTIMATORS, random_state=RANDOM_STATE))
    ])
    pipeline_limit.fit(X_train, y_limit_train)
    metrics["Recommended_Credit_Limit"] = evaluate_regression(pipeline_limit, X_test, y_limit_test, n_test, p)
    joblib.dump(pipeline_limit, MODEL_LIMIT_PATH)

    # Export Metrics and Preprocessors
    with open(METRICS_PATH, 'w') as f:
        json.dump(metrics, f, indent=4)
        
    joblib.dump(preprocessor, PREPROCESSOR_PATH)
    
    # Save column names for reference
    numeric_features = X_train.select_dtypes(include=['int64', 'float64']).columns.tolist()
    categorical_features = X_train.select_dtypes(include=['object']).columns.tolist()
    joblib.dump({'num': numeric_features, 'cat': categorical_features}, FEATURE_NAMES_PATH)
    
    print(f"Models trained and exported successfully. Metrics saved to {METRICS_PATH}")
    print("Preprocessor and feature names saved.")

if __name__ == "__main__":
    train_and_export_models()
