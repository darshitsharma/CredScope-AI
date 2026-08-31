"use client";

import React, { useState, useEffect } from 'react';

// Mock data representing MSME0000001
const mockData = {
  "Customer_Segment": "NTC",
  "Business_Type": "LLP",
  "Industry": "Logistics",
  "Location_Category": "Tier 2",
  "Years_in_Operation": 8.0,
  "Employee_Count": 2,
  "Annual_Turnover_INR": 5854430,
  "Monthly_GST_Sales_INR": 476042,
  "Monthly_GST_Purchases_INR": 327244,
  "GST_Filing_Timeliness_Pct": 85.7,
  "GST_Return_Frequency": "Monthly",
  "Monthly_UPI_Inflow_INR": 181309,
  "Monthly_UPI_Outflow_INR": 131501,
  "UPI_Avg_Ticket_Size_INR": 611,
  "UPI_Daily_Txn_Count": 11.4,
  "Transaction_Volatility_Index": 0.251,
  "Monthly_Bank_Credits_INR": 514240,
  "Monthly_Bank_Debits_INR": 483729,
  "Average_Bank_Balance_INR": 127948,
  "Cashflow_Stability_Index": 0.706,
  "Has_Existing_Loan": "No",
  "Monthly_Loan_EMI_INR": 0,
  "EMI_On_Time_Rate_Pct": 0,
  "Overdraft_Usage_Ratio": 0.231,
  "Monthly_Payroll_INR": 40508,
  "Salary_Consistency_Pct": 87.0,
  "Employee_Attrition_Rate_Pct": 23.1,
  "Avg_Invoice_Payment_Delay_Days": 34.0,
  "Customer_Concentration_Ratio": 0.45,
  "Vendor_Payment_Timeliness_Pct": 90.4,
  "Seasonality_Index": 0.243,
  "Revenue_Growth_Rate_Pct": 31.1,
  "Credit_History_Months": 0
};

export default function Home() {
  const [healthData, setHealthData] = useState<any>(null);
  const [metricsData, setMetricsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showShap, setShowShap] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [showRawData, setShowRawData] = useState(false);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/metrics')
      .then(res => res.json())
      .then(data => setMetricsData(data))
      .catch(err => console.error("Failed to load metrics", err));
  }, []);

  const fetchScore = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8000/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(mockData)
      });
      if (!response.ok) {
        throw new Error('Failed to fetch from backend API');
      }
      const data = await response.json();
      setHealthData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-800 to-black text-slate-100 p-6 md:p-12 font-sans selection:bg-blue-500/30">
      
      {/* HEADER */}
      <header className="mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              CredScope AI
            </h1>
          </div>
          <p className="text-slate-400 text-sm md:text-base max-w-xl">AI-powered credit risk analyzer and alternative financial health assessment for modern MSMEs.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowRawData(true)}
            className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-3 hover:bg-white/10 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">ID: MSME-001</span>
          </button>
          <button 
            onClick={fetchScore} 
            disabled={loading}
            className="relative group overflow-hidden bg-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/50 disabled:opacity-50 disabled:hover:scale-100"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
            <span className="relative">{loading ? 'Processing Tensor...' : 'Run Analysis'}</span>
          </button>
        </div>
      </header>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-4 rounded-xl mb-8 backdrop-blur-md flex items-center">
          <svg className="w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          {error}
        </div>
      )}

      {healthData ? (
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
          
          {/* LEFT COLUMN: Health Score & Metrics */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Info Tip Button */}
            <div className="flex justify-end -mb-4 z-20 relative">
              <button 
                onClick={() => setShowTip(!showTip)}
                className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-full text-xs font-bold tracking-widest transition-colors backdrop-blur-md focus:outline-none"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ARCHITECTURE TIP
              </button>
              
              {showTip && (
                <div className="absolute top-full mt-2 right-0 w-80 bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-2xl text-xs text-slate-300 z-50 animate-in fade-in slide-in-from-top-2 text-left">
                  <p className="mb-2"><strong className="text-white">Live ML Predictions:</strong> The <span className="text-blue-400">Health Index</span>, <span className="text-emerald-400">Credit Limit</span>, <span className="text-emerald-400">Decision Output</span>, and <span className="text-purple-400">SHAP Parameters</span> are dynamically fetched from the live backend models.</p>
                  <p><strong className="text-white">Static UI Widgets:</strong> The six sub-scores below, as well as Risk Indicators and Insights, are currently non-dynamic UI placeholders designed to fulfill assignment UI requirements. They will be integrated with separate specialized ML models in future iterations.</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Score Radial */}
              <div className="md:col-span-1 bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 z-10 text-center">Overall Financial<br/>Health Score</h2>
                
                <div className="relative w-36 h-36 flex items-center justify-center z-10">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="62" fill="none" stroke="currentColor" className="text-slate-800" strokeWidth="8" />
                    <circle 
                      cx="72" cy="72" r="62" fill="none" stroke="currentColor" 
                      className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" 
                      strokeWidth="8" 
                      strokeDasharray="390" 
                      strokeDashoffset={390 - (390 * Math.round(healthData.Financial_Health_Score)) / 100} 
                      strokeLinecap="round" 
                    />
                  </svg>
                  <div className="flex flex-col items-center mt-1">
                    <span className="text-4xl font-black text-white drop-shadow-md">
                      {Math.round(healthData.Financial_Health_Score)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sub-scores Grid */}
              <div className="md:col-span-2 grid grid-cols-2 lg:grid-cols-3 gap-3">
                 <GlassScoreCard title="Business Stability" score={74} icon="🛡️" color="from-emerald-500 to-teal-400" />
                 <GlassScoreCard title="Cash Flow Score" score={69} icon="💸" color="from-blue-500 to-cyan-400" />
                 <GlassScoreCard title="Rev Consistency" score={74} icon="📈" color="from-purple-500 to-indigo-400" />
                 <GlassScoreCard title="Payment Behav." score={82} icon="💳" color="from-pink-500 to-rose-400" />
                 <GlassScoreCard title="Business Growth" score={65} icon="🚀" color="from-yellow-500 to-amber-400" />
                 <GlassScoreCard title="Compliance Score" score={86} icon="🏛️" color="from-orange-500 to-red-400" />
              </div>
            </div>

            {/* AI Explainability (SHAP) */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl group">
              <button 
                onClick={() => setShowShap(!showShap)}
                className="w-full p-6 flex justify-between items-center hover:bg-white/5 transition-colors focus:outline-none"
              >
                <div className="text-left flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-wide">ML Model Explainability</h2>
                    <p className="text-sm text-slate-400 mt-1">SHAP TreeExplainer Impact Analysis (Top 10 parameters)</p>
                  </div>
                </div>
                <div className={`p-2 rounded-full bg-white/10 transform transition-transform duration-300 ${showShap ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </button>
              
              {showShap && (
                <div className="p-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[500px] overflow-y-auto custom-scrollbar">
                  {/* Positive Impacts */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-emerald-400 tracking-widest uppercase mb-4 sticky top-0 bg-slate-900/80 backdrop-blur-md py-2 z-10 border-b border-emerald-500/20">
                      Positive Drivers (++)
                    </h3>
                    {healthData.shap_positive?.map((item: any, i: number) => (
                      <div key={i} className="group/item">
                        <div className="flex justify-between text-sm font-medium mb-1.5">
                          <span className="text-slate-300 group-hover/item:text-white transition-colors">{item.feature.replace(/_/g, ' ')}</span>
                          <span className="text-emerald-400 font-mono">+{item.impact.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-1.5 rounded-full" style={{ width: `${Math.min(100, item.impact * 5)}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Negative Impacts */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-rose-400 tracking-widest uppercase mb-4 sticky top-0 bg-slate-900/80 backdrop-blur-md py-2 z-10 border-b border-rose-500/20">
                      Negative Risk Factors (--)
                    </h3>
                    {healthData.shap_negative?.map((item: any, i: number) => (
                      <div key={i} className="group/item">
                        <div className="flex justify-between text-sm font-medium mb-1.5">
                          <span className="text-slate-300 group-hover/item:text-white transition-colors">{item.feature.replace(/_/g, ' ')}</span>
                          <span className="text-rose-400 font-mono">{item.impact.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 flex justify-end overflow-hidden">
                          <div className="bg-gradient-to-l from-rose-600 to-rose-400 h-1.5 rounded-full" style={{ width: `${Math.min(100, Math.abs(item.impact) * 5)}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Model Evaluation Metrics */}
            {metricsData && (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl group">
                <button 
                  onClick={() => setShowMetrics(!showMetrics)}
                  className="w-full p-6 flex justify-between items-center hover:bg-white/5 transition-colors focus:outline-none"
                >
                  <div className="text-left flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-wide">Model Evaluation Metrics</h2>
                      <p className="text-sm text-slate-400 mt-1">Out-of-sample statistical validation (80/20 Holdout)</p>
                    </div>
                  </div>
                  <div className={`p-2 rounded-full bg-white/10 transform transition-transform duration-300 ${showMetrics ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </button>
                
                {showMetrics && (
                  <div className="p-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 bg-black/20">
                    
                    {/* Regression */}
                    <div>
                      <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-6">Regression Performance</h3>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-sm mb-2 font-medium">
                            <span className="text-slate-300">Adjusted R²</span>
                            <span className="text-white font-mono">{(metricsData.Financial_Health_Score.Adjusted_R2 * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${Math.max(0, metricsData.Financial_Health_Score.Adjusted_R2 * 100)}%` }}></div>
                          </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center backdrop-blur-sm">
                          <span className="text-sm text-slate-400 font-medium">RMSE (Root Mean Square Error)</span>
                          <span className="text-xl font-mono text-white">{metricsData.Financial_Health_Score.RMSE.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Classification */}
                    <div>
                      <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-6">Classification Power</h3>
                      <div className="space-y-6">
                        <div>
                          <div className="flex justify-between text-sm mb-2 font-medium">
                            <span className="text-slate-300">ROC-AUC Score</span>
                            <span className="text-white font-mono">{(metricsData.Credit_Eligible.ROC_AUC * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
                            <div className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: `${metricsData.Credit_Eligible.ROC_AUC * 100}%` }}></div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                          <MetricBox label="Precision" value={metricsData.Credit_Eligible.Precision} />
                          <MetricBox label="Recall" value={metricsData.Credit_Eligible.Recall} />
                          <MetricBox label="F1-Score" value={metricsData.Credit_Eligible.F1} />
                        </div>
                      </div>
                    </div>
                    
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: The Credit Card */}
          <div className="lg:col-span-4 perspective-1000">
            <div className="sticky top-8">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-2">Decision Engine Output</h2>
              
              {/* Premium Credit Card UI */}
              <div className="relative w-full aspect-[1.586/1] rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl transition-transform duration-500 hover:rotate-y-12 hover:rotate-x-12 hover:scale-105 group border border-white/20">
                {/* Dynamic Card Background based on Eligibility */}
                {healthData.Credit_Eligible === 'Yes' ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black z-0">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-red-950 to-black z-0">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                  </div>
                )}

                {/* Card Content */}
                <div className="relative z-10 flex justify-between items-start">
                  {/* Microchip SVG */}
                  <svg className="w-12 h-10 opacity-80 drop-shadow-md" viewBox="0 0 60 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="60" height="45" rx="8" fill="#D4AF37" />
                    <path d="M0 15H20V30H0V15Z" stroke="#B8860B" strokeWidth="1" />
                    <path d="M40 15H60V30H40V15Z" stroke="#B8860B" strokeWidth="1" />
                    <path d="M20 0V45" stroke="#B8860B" strokeWidth="1" />
                    <path d="M40 0V45" stroke="#B8860B" strokeWidth="1" />
                    <path d="M20 22.5H40" stroke="#B8860B" strokeWidth="1" />
                  </svg>
                  
                  {/* Status */}
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md border ${healthData.Credit_Eligible === 'Yes' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'}`}>
                    {healthData.Credit_Eligible === 'Yes' ? 'APPROVED' : 'DECLINED'}
                  </div>
                </div>

                <div className="relative z-10 mt-auto">
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Approved Credit Limit</p>
                  <div className="text-4xl font-mono text-white tracking-tight drop-shadow-md">
                    ₹ {Math.round(healthData.Recommended_Credit_Limit_INR).toLocaleString('en-IN')}
                  </div>
                  
                  <div className="flex justify-between items-end mt-8">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Entity ID</p>
                      <p className="font-mono text-sm text-slate-300 tracking-widest">MSME • 001</p>
                    </div>
                    <div className="w-12 h-12 flex relative">
                       {/* Abstract Logo */}
                       <div className="w-8 h-8 rounded-full bg-blue-500/60 absolute left-0 mix-blend-screen"></div>
                       <div className="w-8 h-8 rounded-full bg-purple-500/60 absolute right-0 mix-blend-screen"></div>
                    </div>
                  </div>
                </div>
                
                {/* Shiny overlay effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 transform -translate-x-full group-hover:translate-x-full ease-in-out z-20 pointer-events-none"></div>
              </div>

              {/* Informational Note */}
              <div className="mt-6 bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                 <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <p className="text-xs text-slate-400 leading-relaxed">
                   Limits are dynamically generated using predictive ML modeling on alternative GST and UPI cashflow metrics.
                 </p>
              </div>

              {/* Risk Indicators */}
              <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest mb-4 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse mr-2"></span>
                  Risk Indicators
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <span>High Dependency on UPI: ~1.8L INR monthly inflow indicates vulnerability to localized digital outages.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <svg className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    <span>Customer Concentration: 45% of total revenue is highly dependent on top client accounts.</span>
                  </li>
                </ul>
              </div>

              {/* Key Insights & Recommendations */}
              <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-4 flex items-center">
                  <svg className="w-4 h-4 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  Key Insights & Recommendations
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-slate-300 border-b border-white/5 pb-3">
                    <span className="text-blue-400 font-bold mt-0.5">1.</span>
                    <span><strong>Consistent GST Filings:</strong> Maintain current 85.7% timeliness to preserve cashflow stability profile.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300 border-b border-white/5 pb-3">
                    <span className="text-blue-400 font-bold mt-0.5">2.</span>
                    <span><strong>Invoice Discounting:</strong> Average payment delay is 34 days. Recommended to use bill discounting to optimize working capital.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-blue-400 font-bold mt-0.5">3.</span>
                    <span><strong>Credit Strategy:</strong> Sanctioned limits can be increased upon 6-month vintage of current working capital facility.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

        </main>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm animate-in fade-in duration-1000">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-xl border border-white/5">
            <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-300 mb-2">Awaiting Data Ingestion</h2>
          <p className="text-slate-500 text-sm max-w-sm text-center">Click "Run Analysis" to execute the XGBoost inference pipeline and visualize the MSME credit risk profile.</p>
        </div>
      )}

      {/* Raw Data Modal */}
      {showRawData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white">Raw Payload Data</h3>
                <p className="text-sm text-slate-400 mt-1">Values passed for MSME-001</p>
              </div>
              <button onClick={() => setShowRawData(false)} className="text-slate-400 hover:text-white p-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-900/50">
              <pre className="text-sm font-mono text-emerald-400 bg-black/50 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">
                {JSON.stringify(mockData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper components
function GlassScoreCard({ title, score, icon, color }: { title: string, score: number, icon: string, color: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors group cursor-default">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-300 transition-colors">{title}</span>
        <span className="text-lg opacity-80">{icon}</span>
      </div>
      <div className={`text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r ${color}`}>
        {score}
      </div>
    </div>
  );
}

function MetricBox({ label, value }: { label: string, value: number }) {
  return (
    <div className="bg-white/5 border border-white/5 p-3 rounded-xl text-center backdrop-blur-sm hover:bg-white/10 transition-colors">
      <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1.5 font-bold">{label}</div>
      <div className="font-mono font-bold text-slate-200">{(value * 100).toFixed(1)}%</div>
    </div>
  );
}

/* Custom CSS to inject for scrollbar and 3D effects (handled via Tailwind arbitrary values mostly, but added utility class below if needed) */
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
    .perspective-1000 { perspective: 1000px; }
    .rotate-y-12 { transform: rotateY(12deg); }
    .rotate-x-12 { transform: rotateX(12deg); }
  `;
  document.head.appendChild(style);
}
