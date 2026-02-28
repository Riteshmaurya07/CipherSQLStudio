# CipherSQLStudio: Project Details & Implementation Guide

## 1. Project Overview

**CipherSQLStudio** is a full-stack, browser-based SQL learning platform. It is designed to provide users with a secure and interactive environment to practice and attempt pre-configured SQL assignments. 

The platform offers a dual-panel interface where users can read problem descriptions, explore database schemas, write SQL queries, and receive AI-powered conceptual hints without exposing the direct solutions.

---

## 2. Technology Stack

### Frontend (User Interface)
The frontend is built for a highly interactive, single-page application experience.
- **Framework**: React.js (Bootstrapped with Vite for fast builds and HMR)
- **Routing**: `react-router-dom` for client-side navigation.
- **Code Editor**: `@monaco-editor/react` providing a robust, VS Code-like SQL writing experience in the browser.
- **Styling**: Vanilla SCSS using a Mobile-First approach and BEM (Block Element Modifier) methodology for maintainable styling.
- **API Client**: `axios` for communicating with the backend APIs.

### Backend (Server & API)
The backend acts as the orchestrator, managing users, assignments, and safely executing SQL queries against the sandbox database.
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens) and `bcryptjs` for secure password hashing.
- **Database Drivers/ORMs**: 
  - `mongoose` for MongoDB interactions.
  - `pg` (node-postgres) for PostgreSQL interactions.

### Databases
The project uniquely leverages two different database systems tailored to their strengths:
- **MongoDB**: Used as the primary application database. It stores user profiles, authentication data, assignment metadata (titles, descriptions, difficulties, expected results), and tracks users' query attempt histories.
- **PostgreSQL**: Used exclusively as a secure **Sandbox Environment**. This database holds the actual tables and data that users will query against when attempting assignments. 

### AI Integration
- **LLM Provider**: Configured to use external LLM APIs (like OpenAI) to provide conceptual hints. Includes fallback stub logic when API keys are not provided.

---

## 3. Architecture & Implementation Details

### 3.1 Folder Structure

The repository is divided into a Node.js backend (`server/`) and a React frontend (`client/`).

```text
├── README.md          # High-level overview
├── project_details.md # This documentation
├── client/            # Frontend React Application
│   ├── src/
│   │   ├── components/  # Reusable UI elements (Sidebar, Editor, etc.)
│   │   ├── context/     # React definitions (AuthContext)
│   │   ├── hooks/       # Custom business logic hooks
│   │   ├── pages/       # Route-level views
│   │   ├── styles/      # Global SCSS, variables, BEM styles
│   │   ├── App.jsx      # React router configuration
│   │   └── main.jsx     # Vite entry point
│   └── package.json
└── server/            # Backend Node.js Application
    ├── .env             # Environment variables
    ├── config/          # DB connection setups (Mongo & PG)
    ├── controllers/     # Route logic handling
    ├── middleware/      # Express middleware (Auth protection)
    ├── models/          # Mongoose database schemas
    ├── routes/          # Express API route definitions
    ├── server.js        # Express app entry point
    └── package.json
```

### 3.2 Frontend Architecture
The React frontend is divided into several logical layers logically structured within the `client/src` directory:

- **Routing (`App.jsx`)**: Defines public routes (`/`, `/login`, `/signup`) and the assignment attempt route (`/assignment/:id`).
- **Context (`AuthContext.jsx`)**: Manages the global authentication state, storing the logged-in user's details and token.
- **Pages**:
  - `AssignmentList.jsx`: Displays all available SQL assignments fetched from MongoDB, categorized by difficulty.
  - `AssignmentAttempt.jsx`: The core workspace. It uses a custom hook (`useAssignmentManager`) to handle complex state logic, keeping the component clean. It renders:
    - `Sidebar`: Shows assignment details, database schema (`tableData`), past query history, and the AI hint interface.
    - `EditorPanel`: Contains the themeable Monaco Editor where users type SQL.
    - `ResultsPanel`: Displays the output of the executed query versus the expected data output to help users verify their solutions.

### 3.2 Backend Architecture
The Express backend organizes logic into standard RESTful patterns within the `server/` directory:

- **Entry Point (`server.js`)**: Connects to both MongoDB and PostgreSQL, configures CORS and JSON parsing, and mounts API routes.
- **Routes (`routes/api.js`)**:
  - `/api/auth`: Handles user registration and login.
  - `/api/assignments`: Fetches assignment metadata from MongoDB.
  - `/api/attempts`: Retrieves execution history/stats (Protected by JWT middleware).
  - `/api/tables/:tableName`: Fetches schema information from the Postgres sandbox.
  - `/api/query/execute`: The core execution endpoint for user-submitted SQL.
  - `/api/hint`: Triggers the AI hint generation generator.
- **Controllers**: Isolate business logic from route definitions (e.g., `queryController.js`, `assignmentController.js`).
- **Models (`models/Assignment.js`)**: Mongoose schemas defining the structure of an Assignment, including `setupQuery`, `solutionQuery`, and conceptual `sourceTables`.

### 3.3 Security & Query Execution Workflow
Executing untrusted SQL queries from users requires strict security measures. CipherSQLStudio implements this securely:

1. **Validation**: Before hitting the database, the backend checks the user query. It blocks multiple statements (by detecting semicolons) and explicitly enforces `SELECT` queries while blacklisting mutating commands (`INSERT`, `UPDATE`, `DELETE`, `DROP`, `TRUNCATE`).
2. **Transaction Isolation**: When a query is passed to PostgreSQL via the `pg` driver, it is wrapped in a `BEGIN READ ONLY` transaction. Even if a user attempts a clever injection to alter data, the database engine will reject it.
3. **Timeouts**: To prevent resource exhaustion (e.g., intentional Cartesian products or infinite loops), a soft-enforced timeout (e.g., 5 seconds) is applied to the Postgres transaction.

---

## 4. Setup & Local Development

To run the application locally, both databases (MongoDB and PostgreSQL) must be running.

### Environment Variables (`server/.env`)
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ciphersql
PG_URI=postgresql://postgres:postgres@localhost:5432/ciphersql
LLM_API_KEY=your_llm_api_key
```

### Running the Backend
1. Navigate to the `server/` directory.
2. Install dependencies: `npm install`
3. Start the server: `node server.js` (Server runs on port 5000)

### Running the Frontend
1. Navigate to the `client/` directory.
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev` (Runs on port 5173 by default)

---

## 5. Future Enhancements / Roadmap
Given the current architecture, the platform can be naturally extended with:
- **Leaderboards & Gamification**: Using the MongoDB attempt logs to score users based on quickness or query efficiency.
- **Multi-Dialect Support**: Extending the sandbox to support MySQL or SQLite via Docker containers instead of direct connections.
- **Admin Dashboard**: A UI for instructors to create new assignments, define expected schema structures, and manage the Postgres sandbox seed data.
