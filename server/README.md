# CipherSQLStudio - Backend API

This directory contains the backend server codebase for **CipherSQLStudio**, built with Express.js and Node.js. It acts as the orchestration layer for the application, connecting the frontend to MongoDB (for user state and metadata) and a secure PostgreSQL sandbox (for safe query execution).

## Core Architecture

- **Framework**: [Express.js](https://expressjs.com/)
- **Database (App State)**: MongoDB / [Mongoose](https://mongoosejs.com/)
- **Database (Sandbox Engine)**: PostgreSQL / [node-postgres](https://node-postgres.com/)
- **Authentication**: JWT & bcryptjs
- **AI Integration**: Custom prompt pipelines routing to an LLM provider (like OpenAI) or utilizing fallback mock data.

## Server Structure

The API logic is organized cleanly within the `server/` directory:

```text
server/
├── config/            # Initialization and connection logic for Postgres and MongoDB.
├── controllers/       # Business logic for all routes (Assignments, Queries, AI Hints).
├── middleware/        # Express middleware (e.g., JWT `protect` for authenticating requests).
├── models/            # Mongoose schemas defining assignments, users, and attempt histories.
├── routes/            # Express route bindings mapping endpoints to controller functions.
├── server.js          # The entry point where middleware is applied and the server listens.
└── package.json       # Project dependencies and basic scripts.
```

## Security Workflow

One of the primary challenges of a SQL learning platform is safely executing untrusted queries sent by students. This backend implements multiple security layers:

1. **Transaction Isolation**: All user-submitted queries are sent to PostgreSQL wrapped explicitly in a `BEGIN READ ONLY` transaction block.
2. **Statement Validation**: A manual pre-check ensures only `SELECT` statements are executed, rejecting mutative commands (`DROP`, `DELETE`, `UPDATE`, `INSERT`). Semicolons are detected and blocked to prevent multiple statements.
3. **Execution Timeouts**: A transaction timeout is set on the PostgreSQL connection to prevent heavy queries (like accidental infinite joins or extremely large cartesian products) from degrading database performance.

## API Endpoints Overview

The API exposes the following primary functions under the `/api` prefix:

- **Authentication (`/auth`)**: Registration and login endpoints returning JWTs.
- **Assignments (`/assignments`)**: Fetch list of assignments or single assignment definitions.
- **Query Sandbox (`/query/execute`)**: Accept user-submitted SQL, run it securely against PostgreSQL, and compare the result payload with the expected assignment output. Records the attempt log in MongoDB if the user is authenticated.
- **Hints (`/hint`)**: Accepts the current query string and assignment details, generating a conceptual hint using LLMs.
- **Schema Helper (`/tables/:tableName`)**: Proxies schema and sample row data from Postgres structure to display in the frontend editor panel.
- **Attempts (`/attempts/...`)**: Protected endpoints to retrieve a user's previous attempt history.

## Getting Started

### Prerequisites

You must have **MongoDB** and **PostgreSQL** running on your local machine or accessible via remote URIs.

### Installation

Navigate to the `server` directory and install the necessary dependencies:

```bash
cd server
npm install
```

### Environment Variables

The server relies on configuration defined in a `.env` file located in the server directory (`.env`). Ensure it contains the necessary keys:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ciphersql
PG_URI=postgresql://postgres:postgres@localhost:5432/ciphersql
LLM_API_KEY=your_llm_api_key
```

### Running the Server

Start the API server in a development environment:

```bash
node server.js
```

The server will display successful connection messages for both MongoDB and PostgreSQL upon startup.
