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


### Screenshots
## web
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f1c18ab5-2549-4e39-bc94-6e953bb1527e" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/aedc0a74-e1b3-4a13-b24c-694bca65538e" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/84d59073-11ad-4529-ab14-98c1a8ae095d" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/d7f638c2-91aa-438e-902c-ba70cf0cc63c" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/fe4d38d2-19f4-4948-9836-bfb81a43c789" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/1f6dbbf7-5be2-4c90-a849-03b880115922" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/39142f84-481c-46ae-8754-003de3c522ec" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/44d377e5-b154-442f-9cc3-1b8231599ff8" />


##Mobile
## 📸 Application Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/2c763943-6365-4d38-86c1-5331f11ea613" width="600"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/bc2d7f79-5445-4132-b0f5-c028d0b2aa65" width="600"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/3155056c-e1ff-4b44-9b0d-27add7403d7b" width="600"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/6ceef1af-29f6-4ce7-900d-7ce763f0012c" width="600"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/d8f4a1f3-3362-41e2-a80f-9892b68bd78e" width="600"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/f413ef2d-5520-48d8-ae77-45bc7ad77458" width="600"/>
</p>
### Demo Video
https://drive.google.com/file/d/1hXuFEyJLijSpgLIa7FIL9zC35PA-h9Af/view?usp=sharing
