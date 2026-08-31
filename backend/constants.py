import os

# Base paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_PIPELINE_DIR = os.path.join(BASE_DIR, 'ml_pipeline')

# Machine Learning Model File Paths
MODEL_SCORE_PATH = os.path.join(ML_PIPELINE_DIR, 'health_score_model.pkl')
MODEL_ELIGIBLE_PATH = os.path.join(ML_PIPELINE_DIR, 'credit_eligible_model.pkl')
MODEL_LIMIT_PATH = os.path.join(ML_PIPELINE_DIR, 'credit_limit_model.pkl')
PREPROCESSOR_PATH = os.path.join(ML_PIPELINE_DIR, 'preprocessor.pkl')

# Metrics File Path
METRICS_PATH = os.path.join(ML_PIPELINE_DIR, 'model_metrics.json')

# Application Settings
TOP_SHAP_FEATURES = 10
