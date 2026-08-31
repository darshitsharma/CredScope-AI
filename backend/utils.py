import pandas as pd
import shap
from typing import Tuple, List
from .models import SHAPFeature
from .constants import TOP_SHAP_FEATURES

def add_interaction_features(df_input: pd.DataFrame) -> pd.DataFrame:
    """
    Engineers advanced financial ratios (interaction features) from the raw input data.
    
    Args:
        df_input (pd.DataFrame): The raw input DataFrame.
        
    Returns:
        pd.DataFrame: A new DataFrame containing both the original columns and the engineered ratios.
    """
    df_new = df_input.copy()
    df_new['Debt_to_Income_Ratio'] = df_new['Monthly_Loan_EMI_INR'] / (df_new['Monthly_Bank_Credits_INR'] + 1)
    df_new['GST_Margin_Proxy'] = (df_new['Monthly_GST_Sales_INR'] - df_new['Monthly_GST_Purchases_INR']) / (df_new['Monthly_GST_Sales_INR'] + 1)
    df_new['UPI_Dependency_Ratio'] = (df_new['Monthly_UPI_Inflow_INR'] * 12) / (df_new['Annual_Turnover_INR'] + 1)
    df_new['Operating_Cashflow_Burn'] = df_new['Monthly_Bank_Debits_INR'] / (df_new['Monthly_Bank_Credits_INR'] + 1)
    df_new['Payroll_Burden'] = df_new['Monthly_Payroll_INR'] / (df_new['Monthly_Bank_Credits_INR'] + 1)
    df_new['Compliance_Trust_Score'] = (df_new['GST_Filing_Timeliness_Pct'] + df_new['Vendor_Payment_Timeliness_Pct'] + df_new['Salary_Consistency_Pct']) / 3
    df_new['Stability_Index'] = df_new['Years_in_Operation'] / (df_new['Transaction_Volatility_Index'] + 0.01)
    return df_new

def extract_shap_impacts(df: pd.DataFrame, preprocessor, model_score) -> Tuple[List[SHAPFeature], List[SHAPFeature]]:
    """
    Extracts the top positive and negative SHAP impacts for a given prediction.
    
    Args:
        df (pd.DataFrame): The dataframe containing the input features.
        preprocessor: The fitted column transformer.
        model_score: The trained XGBoost pipeline containing the model.
        
    Returns:
        Tuple[List[SHAPFeature], List[SHAPFeature]]: A tuple containing lists of top positive and negative impacts.
    """
    try:
        X_transformed = preprocessor.transform(df)
        xgb_model = model_score.named_steps['model']
        
        # Using TreeExplainer since XGBoost was downgraded to a stable version
        explainer = shap.TreeExplainer(xgb_model)
        shap_vals = explainer.shap_values(X_transformed)
        feature_names = preprocessor.get_feature_names_out()
        
        shap_dict = dict(zip(feature_names, shap_vals[0]))
        pos = sorted([(k, v) for k, v in shap_dict.items() if v > 0], key=lambda x: x[1], reverse=True)[:TOP_SHAP_FEATURES]
        neg = sorted([(k, v) for k, v in shap_dict.items() if v < 0], key=lambda x: x[1])[:TOP_SHAP_FEATURES]
        
        positive_impacts = [SHAPFeature(feature=k.split('__')[-1], impact=float(v)) for k, v in pos]
        negative_impacts = [SHAPFeature(feature=k.split('__')[-1], impact=float(v)) for k, v in neg]
        
        return positive_impacts, negative_impacts
    except Exception as e:
        print(f"SHAP extraction failed. Error: {e}")
        return [], []
