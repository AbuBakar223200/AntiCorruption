# AntiCorruption Reporting Platform

A secure, anonymous platform for community-driven corruption reporting and voting.

## Project Structure

- `backend/`: Node.js, Express, MongoDB API.
- `frontend/`: Next.js 14, Tailwind CSS, React.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Backend Setup
1. Navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file (see `.env.example`).
4. Start server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` (see `.env.example`).
4. Start development server:
   ```bash
   npm run dev
   ```

## Features
- Anonymous Reporting
- Community Voting (Reliability Score)
- Location & Category Filtering
- Admin Moderation
