# 🧠 Wumpus Logic Agent

A Knowledge-Based Agent that navigates a Wumpus World grid using Propositional Logic and Resolution Refutation.

## 📌 Project Overview
This project implements a Dynamic Wumpus World agent that:
- Navigates a grid without knowing hazard locations
- Uses a Propositional Logic Knowledge Base to store percept rules
- Converts rules to CNF and runs Resolution Refutation to prove cells safe
- Visualizes the agent's decisions in real time on a web interface

## 🚀 Features
- Dynamic grid sizing (Rows × Cols defined by user)
- Random Pit and Wumpus placement every episode
- Propositional Logic Knowledge Base (KB)
- CNF conversion and Resolution Refutation engine
- Real-time inference step counter
- Color-coded grid — Agent / Visited / KB-Safe / Unknown
- Live percept display — Breeze and Stench detection
- KB Suggest feature — recommends proven safe moves

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| Backend | Python 3, Flask, Flask-CORS |
| Frontend | React, Vite |
| Logic Engine | Custom CNF + Resolution Refutation |
| Deployment | Vercel (frontend), Render (backend) |

## ▶️ How to Run Locally

### Backend
cd backend
pip install -r requirements.txt
python app.pyRuns on: http://127.0.0.1:5000

### Frontend
cd frontend
npm install
npm run dev
Runs on: http://localhost:5173

## 🧠 How the Logic Works

1. Agent starts at cell (0,0)
2. Receives Breeze or Stench percepts from environment
3. KB stores CNF clauses — example:
   - No Breeze at (0,0) → No pit in (0,1) or (1,0)
   - Breeze at (1,1) → Pit in (0,1) OR (1,0) OR (1,2) OR (2,1)
4. Before moving, Resolution Refutation proves if next cell is safe
5. Agent moves to proven-safe cells first

## 📁 Project Structure
