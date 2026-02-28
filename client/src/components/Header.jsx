import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/main.scss';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="site-header">
            <div className="logo">
                <Link to="/">CipherSQL</Link>
            </div>
            <nav className="desktop-nav">
                {user ? (
                    <div className="auth-links">
                        <span className="welcome-text">Welcome, {user.name}</span>
                        <button className="btn btn--outline" onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <div className="auth-links">
                        <Link to="/login" className="btn btn--outline">Login</Link>
                        <Link to="/signup" className="btn">Sign Up</Link>
                    </div>
                )}
            </nav>

            {/* Hamburger Icon */}
            <button className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Mobile Nav Dropdown */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                {user ? (
                    <div className="mobile-auth-links">
                        <span className="welcome-text">Welcome, {user.name}</span>
                        <button className="btn btn--outline" onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <div className="mobile-auth-links">
                        <Link to="/login" className="btn btn--outline" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                        <Link to="/signup" className="btn" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
