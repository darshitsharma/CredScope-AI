import sys
import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

# Add the root directory to sys.path so we can import from backend
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.utils import add_interaction_features
from config import (
    DATA_PATH, DROP_COLS, TARGET_SCORE, TARGET_ELIGIBLE, TARGET_LIMIT,
    TEST_SIZE, RANDOM_STATE
)

def load_data(filepath: str = DATA_PATH) -> pd.DataFrame:
    """Loads the dataset."""
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Dataset not found at {filepath}")
    return pd.read_csv(filepath)

def prepare_datasets(df: pd.DataFrame):
    """
    Applies interaction features, performs train/test split, and isolates targets.
    Returns: X_train, X_test, y_score_train, y_score_test, y_eligible_train, y_eligible_test, y_limit_train, y_limit_test
    """
    # 1. Apply feature engineering from backend
    df = add_interaction_features(df)
    
    # 2. Perform 80/20 train-test split on the whole dataframe
    df_train, df_test = train_test_split(df, test_size=TEST_SIZE, random_state=RANDOM_STATE)
    
    # 3. Isolate features
    X_train = df_train.drop(columns=DROP_COLS)
    X_test = df_test.drop(columns=DROP_COLS)
    
    # 4. Isolate Targets
    y_score_train = df_train[TARGET_SCORE]
    y_score_test = df_test[TARGET_SCORE]
    
    y_eligible_train = df_train[TARGET_ELIGIBLE].apply(lambda x: 1 if x == 'Yes' else 0)
    y_eligible_test = df_test[TARGET_ELIGIBLE].apply(lambda x: 1 if x == 'Yes' else 0)
    
    y_limit_train = df_train[TARGET_LIMIT].fillna(0)
    y_limit_test = df_test[TARGET_LIMIT].fillna(0)
    
    return (X_train, X_test, 
            y_score_train, y_score_test, 
            y_eligible_train, y_eligible_test, 
            y_limit_train, y_limit_test)

def get_preprocessor(X_train: pd.DataFrame) -> ColumnTransformer:
    """Creates the scikit-learn preprocessing pipeline."""
    numeric_features = X_train.select_dtypes(include=['int64', 'float64']).columns
    categorical_features = X_train.select_dtypes(include=['object']).columns

    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])
        
    return preprocessor
