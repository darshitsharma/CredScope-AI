from pydantic import BaseModel
from typing import Optional, List

class MSMEData(BaseModel):
    Customer_Segment: str
    Business_Type: str
    Industry: str
    Location_Category: str
    Years_in_Operation: float
    Employee_Count: int
    Annual_Turnover_INR: float
    Monthly_GST_Sales_INR: float
    Monthly_GST_Purchases_INR: float
    GST_Filing_Timeliness_Pct: float
    GST_Return_Frequency: str
    Monthly_UPI_Inflow_INR: float
    Monthly_UPI_Outflow_INR: float
    UPI_Avg_Ticket_Size_INR: float
    UPI_Daily_Txn_Count: float
    Transaction_Volatility_Index: float
    Monthly_Bank_Credits_INR: float
    Monthly_Bank_Debits_INR: float
    Average_Bank_Balance_INR: float
    Cashflow_Stability_Index: float
    Has_Existing_Loan: str
    Monthly_Loan_EMI_INR: float
    EMI_On_Time_Rate_Pct: float
    Overdraft_Usage_Ratio: float
    Monthly_Payroll_INR: float
    Salary_Consistency_Pct: float
    Employee_Attrition_Rate_Pct: float
    Avg_Invoice_Payment_Delay_Days: float
    Customer_Concentration_Ratio: float
    Vendor_Payment_Timeliness_Pct: float
    Seasonality_Index: float
    Revenue_Growth_Rate_Pct: float
    Credit_History_Months: int

class SHAPFeature(BaseModel):
    feature: str
    impact: float

class HealthCardResponse(BaseModel):
    Financial_Health_Score: float
    Credit_Eligible: str
    Recommended_Credit_Limit_INR: float
    shap_positive: List[SHAPFeature] = []
    shap_negative: List[SHAPFeature] = []

class RegressionMetrics(BaseModel):
    RMSE: float
    R2: float
    Adjusted_R2: float

class ClassificationMetrics(BaseModel):
    Accuracy: float
    Precision: float
    Recall: float
    F1: float
    ROC_AUC: float

class MetricsResponse(BaseModel):
    Financial_Health_Score: RegressionMetrics
    Credit_Eligible: ClassificationMetrics
    Recommended_Credit_Limit: RegressionMetrics
