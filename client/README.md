# CipherSQLStudio - Frontend

This is the frontend application for **CipherSQLStudio**, a browser-based SQL learning platform. It provides a highly interactive and responsive user interface for students to browse assignments, write SQL queries, and receive AI-powered hints.

## Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Code Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react) for a VS Code-like SQL editing experience in the browser.
- **Styling**: Vanilla SCSS (Sass) utilizing a mobile-first approach and the BEM (Block Element Modifier) methodology.
- **HTTP Client**: [Axios](https://axios-http.com/) for API communication with the backend.

## Key Features

- **Interactive SQL Workspace**: A split-panel view containing problem descriptions, an interactive database schema explorer, and the Monaco SQL editor.
- **Real-time Feedback**: Displays query execution results, errors, and compares them against the expected output formatting.
- **AI Tutor Integration**: Interface to request and display conceptual AI hints for the specific assignment and written query.
- **Responsive Design**: Carefully crafted SCSS components ensure the application is functional across device sizes.
- **Authentication**: User login and registration flows for tracking assignment progress and attempt history.

## Folder Structure

The application source code is located in the `src/` directory:

```text
src/
├── components/       # Reusable UI components
│   ├── assignment/   # Components specific to the SQL workspace (Editor, Sidebar, Results)
│   └── Header.jsx    # Global navbar
├── context/          # React Context providers (AuthContext for user state)
├── hooks/            # Custom React hooks (useAssignmentManager for abstracting complex state)
├── pages/            # Top-level route components (Login, Signup, AssignmentList, AssignmentAttempt)
├── styles/           # Global SCSS files, variables, partials, and mixins
├── App.jsx           # Main application component and routing configuration
└── main.jsx          # Application root entry point
```

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher recommended) installed.
The backend server must also be configured and running for full application functionality.

### Installation

1. Navigate to the `client` directory (if you aren't already there):
   ```bash
   cd client
   ```
2. Install the necessary dependencies:
   ```bash
   npm install
   ```

### Development Server

To start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

To create an optimized production build:

```bash
npm run build
```

This will generate a `dist/` directory containing the statically compiled assets ready for deployment.

### Linting

To run ESLint and check for codebase issues:

```bash
npm run lint
```
