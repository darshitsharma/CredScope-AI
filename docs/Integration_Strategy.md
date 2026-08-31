# Integration Strategy

This document outlines how the MSME Financial Health Card solution integrates with India's digital public infrastructure.

## 1. Unified Lending Interface (ULI) Integration

The ULI enables seamless flow of digital information and land records to lenders. Our solution integrates with ULI to:
- **Fetch Consent-based Data**: Reduce the friction in onboarding MSMEs by directly fetching verified business entity data and registration details.
- **Credit Assessment**: Incorporate the verified data directly into our data ingestion pipeline (`/api/ingest`), ensuring high-quality inputs for the ML models.

## 2. Open Credit Enablement Network (OCEN) Integration

OCEN standardizes the interaction between Loan Service Providers (LSPs) and lenders.
- **Standardized API Contracts**: Our FastAPI backend can expose OCEN-compliant endpoints (e.g., `Loan Application`, `Offer Generation`).
- **Real-time Scoring**: When an LSP submits an MSME's profile via OCEN, our API instantly evaluates the profile and generates a Financial Health Score and Credit Limit, allowing the lender to return an immediate loan offer.

## 3. Account Aggregator (AA) Ecosystem

The Account Aggregator framework provides consent-driven access to financial data.
- **Bank Statements & Transactions**: Instead of relying on manual uploads, our system will initiate a consent request via an AA.
- **Continuous Monitoring**: Post-disbursal, we can periodically request data (with consent) to monitor cash flow stability and update the Financial Health Score dynamically, acting as an early warning system for defaults.

## 4. GSTN and Banking APIs

- **GSTN Integration**: Direct integration with GST APIs to fetch filing timeliness, monthly sales, and purchase data. This ensures the `Monthly_GST_Sales_INR` and `GST_Filing_Timeliness_Pct` features are highly accurate.
- **Banking APIs**: Fetching UPI transaction volumes and average ticket sizes to gauge the daily operational volume of micro-enterprises that heavily rely on digital payments.
