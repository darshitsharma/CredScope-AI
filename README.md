# MSME Financial Health Card Assignment

This repository contains the complete solution for the Cars24 MSME Financial Health Card Assignment.

## Architecture

The solution consists of three main components:
1. **AI/ML Pipeline (`ml_pipeline/`)**: Trains XGBoost models for predicting the Financial Health Score, Credit Eligibility, and Recommended Credit Limit using alternative financial data. Includes SHAP for explainability.
2. **Backend API (`backend/`)**: A FastAPI application that serves the ML models and exposes endpoints for data ingestion, score generation, and credit recommendations.
3. **Frontend Dashboard (`frontend/`)**: A Next.js application built with Tailwind CSS that visualizes the MSME Financial Health Card, showing key metrics, risk indicators, and explainability charts.

## Prerequisites

- Node.js (v18+)
- Python (3.9+)

## Setup and Run Instructions

### 1. ML Pipeline & Backend API (Python)

1. Navigate to the project root:
   ```bash
   cd project_x24
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Train the models (requires `msme_synthetic_50k.csv` in the root directory):
   ```bash
   python ml_pipeline/train_models.py
   ```
5. Run the FastAPI backend:
   ```bash
   uvicorn backend.main:app --reload --port 8000
   ```
   The backend will be available at `http://localhost:8000`. You can view the API documentation at `http://localhost:8000/docs`.

### 2. Frontend Dashboard (Next.js)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd project_x24/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The dashboard will be available at `http://localhost:3000`.

## Project Structure

- `ml_pipeline/train_models.py`: Model training and export script.
- `backend/main.py`: FastAPI backend entry point.
- `backend/models.py`: Pydantic schemas.
- `frontend/src/app/page.tsx`: Main dashboard UI (Next.js App Router).
- `docs/`: Contains detailed architecture and integration strategy documentation.

## Notes

- The models predict the overall `Financial_Health_Score`, `Credit_Eligible` status, and `Recommended_Credit_Limit_INR` based on the synthetic data provided.
- Ensure the backend is running on port 8000 before interacting with the dashboard, as it makes API calls to generate the scores.
