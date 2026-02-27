import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AssignmentList from './pages/AssignmentList';
import AssignmentAttempt from './pages/AssignmentAttempt';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header />
          <Routes>
            <Route path="/" element={<AssignmentList />} />
            <Route path="/assignment/:id" element={<AssignmentAttempt />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
