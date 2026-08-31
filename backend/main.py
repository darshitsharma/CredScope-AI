from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import os
import json
from typing import Dict, Any
from .models import MSMEData, HealthCardResponse, MetricsResponse
from .utils import add_interaction_features, extract_shap_impacts
from .constants import MODEL_SCORE_PATH, MODEL_ELIGIBLE_PATH, MODEL_LIMIT_PATH, PREPROCESSOR_PATH, METRICS_PATH

app = FastAPI(title="MSME Financial Health Card API", description="API for assessing MSME creditworthiness.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Globals for models
model_score: Any = None
model_eligible: Any = None
model_limit: Any = None
preprocessor: Any = None

@app.on_event("startup")
def load_models() -> None:
    """
    Loads all pre-trained machine learning models and preprocessing pipelines into memory on application startup.
    
    This function reads the serialized .pkl files from the ml_pipeline directory and assigns them to global variables.
    If the models are not found or fail to load, a warning is printed to the console but the application continues to start.
    
    Returns:
        None
    """
    global model_score, model_eligible, model_limit, preprocessor
    try:
        model_score = joblib.load(MODEL_SCORE_PATH)
        model_eligible = joblib.load(MODEL_ELIGIBLE_PATH)
        model_limit = joblib.load(MODEL_LIMIT_PATH)
        preprocessor = joblib.load(PREPROCESSOR_PATH)
        print("Models loaded successfully.")
    except Exception as e:
        print(f"Warning: Models could not be loaded. Please ensure they are trained. Error: {e}")


@app.post("/api/score", response_model=HealthCardResponse)
def generate_score(data: MSMEData) -> HealthCardResponse:
    """
    Processes incoming MSME financial data, generates interaction features, and returns AI-driven credit predictions.
    
    This endpoint takes a JSON payload of raw MSME data, engineers new financial ratios, and passes the enriched
    data through three XGBoost models to predict:
    1. Financial Health Score (Regression)
    2. Credit Eligibility (Classification)
    3. Recommended Credit Limit (Regression)
    It also performs a SHAP analysis to extract the top positive and negative features influencing the health score.
    
    Args:
        data (MSMEData): The raw financial and demographic data of the MSME.
        
    Returns:
        HealthCardResponse: An object containing the predicted score, eligibility, credit limit, and SHAP impacts.
        
    Raises:
        HTTPException: If the models are not loaded (503) or if an internal prediction error occurs (500).
    """
    if not model_score:
        raise HTTPException(status_code=503, detail="Models not loaded")

    # Convert incoming data to DataFrame
    df = pd.DataFrame([data.dict()])
    
    # Engineer interaction features
    df = add_interaction_features(df)
    
    # Generate Predictions
    try:
        score = model_score.predict(df)[0]
        eligible_pred = model_eligible.predict(df)[0]
        eligible_str = "Yes" if eligible_pred == 1 else "No"
        limit = model_limit.predict(df)[0]
        
        # Ensure limit is not negative
        limit = max(0, float(limit))
        
        # --- SHAP Explainability Logic ---
        positive_impacts, negative_impacts = extract_shap_impacts(df, preprocessor, model_score)
        
        return HealthCardResponse(
            Financial_Health_Score=float(score),
            Credit_Eligible=eligible_str,
            Recommended_Credit_Limit_INR=limit,
            shap_positive=positive_impacts,
            shap_negative=negative_impacts
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/metrics", response_model=MetricsResponse)
def get_metrics() -> MetricsResponse:
    """
    Retrieves global out-of-sample evaluation metrics for the deployed models.
    
    This endpoint reads the statically generated `model_metrics.json` file produced during the 
    training phase, which contains evaluation metrics (like RMSE, Adjusted R2, ROC-AUC) calculated
    on a holdout test set (80/20 split).
    
    Returns:
        MetricsResponse: A structured payload containing regression and classification metrics.
        
    Raises:
        HTTPException: If the `model_metrics.json` file is missing (404).
    """
    if not os.path.exists(METRICS_PATH):
        raise HTTPException(status_code=404, detail="Metrics file not found. Ensure models are trained.")
    
    with open(METRICS_PATH, 'r') as f:
        metrics = json.load(f)
    
    return MetricsResponse(**metrics)

@app.get("/api/health")
def health_check() -> Dict[str, str]:
    """
    A simple health check endpoint to verify the API is running.
    
    Returns:
        Dict[str, str]: A dictionary indicating the service is 'ok'.
    """
    return {"status": "ok"}
