# CipherSQLStudio

A full-stack, browser-based SQL learning platform where users can attempt pre-configured SQL assignments. It provides a secure environment to execute read-only queries against a PostgreSQL database, alongside AI-powered conceptual hints.

## Architecture

- **Frontend**: React.js (Vite), Monaco Editor, Vanilla SCSS (Mobile-First, BEM)
- **Backend**: Node.js, Express.js
- **Database**:
  - PostgreSQL (Sandbox for secure query execution)
  - MongoDB (Assignments metadata and tracking user query attempts)
- **AI Integration**: Fallback mock logic for LLM-based hints, with stubs ready for major APIs (OpenAI HTTP).

## Features

- **Assignment Listing**: Browse available SQL questions and difficulties.
- **SQL Sandbox Environment**: 
  - Dual-panel interface with question instructions, sample schema, and Monaco SQL Editor.
  - Secure query checks: Enforces `SELECT` only, blocks drop/truncate/insert/update/delete.
  - Semicolon detection blocks multiple statements.
  - Query timeouts of 5s dynamically set via Postgres transactions.
- **AI Tutors**: Get conceptual hints for the problem based on the assignment and your current query without receiving final solutions.

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL running locally or remotely
- MongoDB running locally or remotely
- Optional: API Key for LLM provider (set up in the `.env`)

### 2. Environment Configuration
Create an `.env` file in the `server/` directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ciphersql
PG_URI=postgresql://postgres:postgres@localhost:5432/ciphersql
LLM_API_KEY=your_llm_api_key
```

### 3. Install Dependencies
**Backend**
```bash
cd server
npm install
```

**Frontend**
```bash
cd client
npm install
```

### 4. Running the Application

**Run Backend API Server (Port 5000)**
```bash
cd server
node server.js
```

**Run Frontend Development Server (Port 5173 by default)**
```bash
cd client
npm run dev
```

## Security

Query execution leverages `pg` driver using read-only database connections wrapped in `BEGIN READ ONLY` transactions. This ensures users cannot maliciously alter or drop assignment datasets. A soft-enforced timeout limits resource abuse.

## Folder Structure

```
├── README.md
├── client/
│   ├── src/
│   │   ├── pages/         # React Views (Listing and Attempt pages)
│   │   ├── styles/        # SCSS (BEM, Partials, Variables)
│   │   ├── App.jsx        # Routing 
│   │   └── main.jsx       # Entrypoint
│   └── package.json
└── server/
    ├── .env               # Environment Config
    ├── config/            # DB Connectors
    ├── controllers/       # Route Logic
    ├── models/            # Mongoose Schemas
    ├── routes/            # Express Routers
    ├── server.js          # Entrypoint
    └── package.json
```
