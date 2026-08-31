import numpy as np
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    mean_squared_error,
    precision_score,
    r2_score,
    recall_score,
    roc_auc_score,
)

def calc_adj_r2(r2: float, n: int, p: int) -> float:
    """Calculates Adjusted R2."""
    return 1 - (1 - r2) * (n - 1) / (n - p - 1)

def evaluate_regression(model, X_test, y_test, n_test: int, p: int) -> dict:
    """Calculates evaluation metrics for a regression model."""
    preds = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, preds))
    r2 = r2_score(y_test, preds)
    adj_r2 = calc_adj_r2(r2, n_test, p)
    
    return {
        "RMSE": float(rmse),
        "R2": float(r2),
        "Adjusted_R2": float(adj_r2)
    }

def evaluate_classification(model, X_test, y_test) -> dict:
    """Calculates evaluation metrics for a classification model."""
    preds = model.predict(X_test)
    preds_proba = model.predict_proba(X_test)[:, 1]
    
    return {
        "Accuracy": float(accuracy_score(y_test, preds)),
        "Precision": float(precision_score(y_test, preds)),
        "Recall": float(recall_score(y_test, preds)),
        "F1": float(f1_score(y_test, preds)),
        "ROC_AUC": float(roc_auc_score(y_test, preds_proba))
    }
