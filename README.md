# ServiceHub – Centralized Microservices Integration & Monitoring Platform

A premium full-stack MEAN application for managing, testing, and monitoring distributed microservices.

## 🚀 Features

- **Centralized Dashboard**: Real-time stats, latency tracking, and success rate monitoring.
- **Service Management**: CRUD operations for API endpoints with environment-specific configurations.
- **Live Monitoring**: Real-time request/response stream using Socket.io.
- **API Testing Console**: Integrated environment for sending manual requests and inspecting JSON payloads.
- **Trace Logs**: Comprehensive audit trail with historical data and error tracking.
- **Service Orchestration**: Visual workflow builder for chaining multiple APIs.
- **Premium Aesthetics**: Glassmorphism design, dark mode, and smooth animations.

## 🛠️ Tech Stack

- **Frontend**: Angular 17/18+ (Standalone Components, Signals-ready logic)
- **Backend**: Node.js & Express.js
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **Security**: JWT-based Authentication

## 🏁 Getting Started

### Prerequisites
- Node.js installed
- MongoDB running locally (default: `mongodb://localhost:27017/servicehub`)

### Installation & Execution

1. **Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

### Seeding Data (Optional)
To see the dashboard with beautiful charts and sample services immediately:
```bash
cd backend
node seed.js
```
*Note: Ensure you have registered at least one user account in the app before running the seed script.*

## 📁 Project Structure

- `backend/`: Node/Express server, models, controllers, and socket logic.
- `frontend/`: Angular application with services, guards, and premium UI components.
"# mini_project_meanstack" 
"# mini_project_meanstack" 
