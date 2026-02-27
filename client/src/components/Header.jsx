import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/main.scss';

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="site-header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 32px',
            background: 'rgba(30,30,30,0.8)',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                <Link to="/" style={{ color: '#00e5ff' }}>CipherSQL</Link>
            </div>
            <nav>
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ color: '#f5f5f5' }}>Welcome, {user.name}</span>
                        <button className="btn btn--outline" onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <Link to="/login" className="btn btn--outline">Login</Link>
                        <Link to="/signup" className="btn">Sign Up</Link>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;
