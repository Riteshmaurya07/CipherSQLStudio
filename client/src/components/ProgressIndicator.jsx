import React, { useState } from 'react';

const ProgressIndicator = ({ stats }) => {
    const [expanded, setExpanded] = useState(false);

    if (!stats) return null;

    return (
        <div
            style={{
                background: 'rgba(30, 30, 30, 0.8)',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
                cursor: 'pointer',
                transition: 'all 0.3s'
            }}
            onClick={() => setExpanded(!expanded)}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ margin: 0, color: '#f5f5f5' }}>Your Progress</h3>
                    <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>
                        You have solved <strong style={{ color: '#00e5ff' }}>{stats.Total || 0}</strong> unique assignment(s).
                    </p>
                </div>
                <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: '4px solid #00e5ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00e5ff',
                    fontWeight: 'bold'
                }}>
                    {stats.Total || 0}
                </div>
            </div>

            {expanded && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #444', display: 'flex', justifyContent: 'space-around' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#69f0ae', fontWeight: 'bold', fontSize: '1.2rem' }}>{stats.Easy || 0}</div>
                        <div style={{ color: '#aaa', fontSize: '0.8rem' }}>Easy</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '1.2rem' }}>{stats.Medium || 0}</div>
                        <div style={{ color: '#aaa', fontSize: '0.8rem' }}>Medium</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#ff5252', fontWeight: 'bold', fontSize: '1.2rem' }}>{stats.Hard || 0}</div>
                        <div style={{ color: '#aaa', fontSize: '0.8rem' }}>Hard</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgressIndicator;
