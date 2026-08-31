import os

BASE_PATH = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_PIPELINE_DIR = os.path.join(BASE_PATH, 'ml_pipeline')

# File Paths
DATA_PATH = os.path.join(BASE_PATH, 'msme_synthetic_50k.csv')
MODEL_SCORE_PATH = os.path.join(ML_PIPELINE_DIR, 'health_score_model.pkl')
MODEL_ELIGIBLE_PATH = os.path.join(ML_PIPELINE_DIR, 'credit_eligible_model.pkl')
MODEL_LIMIT_PATH = os.path.join(ML_PIPELINE_DIR, 'credit_limit_model.pkl')
PREPROCESSOR_PATH = os.path.join(ML_PIPELINE_DIR, 'preprocessor.pkl')
FEATURE_NAMES_PATH = os.path.join(ML_PIPELINE_DIR, 'feature_names.pkl')
METRICS_PATH = os.path.join(ML_PIPELINE_DIR, 'model_metrics.json')

# Targets
TARGET_SCORE = 'Financial_Health_Score'
TARGET_ELIGIBLE = 'Credit_Eligible'
TARGET_LIMIT = 'Recommended_Credit_Limit_INR'

# Columns to drop before training
DROP_COLS = [
    'MSME_ID', 'Business_Stability_Score', 'Cashflow_Score', 
    'Revenue_Consistency_Score', 'Payment_Behaviour_Score', 
    'Business_Growth_Score', 'Compliance_Score', TARGET_SCORE,
    'Probability_of_Default', 'Credit_Risk_Category', TARGET_ELIGIBLE, TARGET_LIMIT
]

# Hyperparameters
TEST_SIZE = 0.2
RANDOM_STATE = 42
N_ESTIMATORS = 100
