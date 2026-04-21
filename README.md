# industrial-monitoring-system
# Industrial Monitoring System (AI + Data Mining)

## Overview
Real-time industrial monitoring platform that analyzes sensor data
and detects anomalies using data mining concepts.

## Features
- Real-time sensor ingestion
- Live dashboard with charts
- Alert detection system
- Theme switching UI
- Data analytics (avg temperature, vibration)
- REST API (FastAPI)

## Tech Stack
Frontend:
- React + TypeScript
- Tailwind CSS
- Recharts

Backend:
- FastAPI
- SQLite

Concepts Used (IMPORTANT)
- Streaming data simulation
- Aggregation (avg, counts)
- Time-series analysis
- Anomaly detection rules

## How to Run

### Backend
cd backend
uvicorn app.main:app --reload

### Frontend
cd frontend
npm install
npm run dev

## Demo Credentials
admin@industrial.com / admin123
