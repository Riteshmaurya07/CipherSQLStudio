import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AssignmentAttempt = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [assignment, setAssignment] = useState(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [expectedData, setExpectedData] = useState(null);
    const [error, setError] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [hint, setHint] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [tableData, setTableData] = useState({});
    const [editorTheme, setEditorTheme] = useState('vs-dark');

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await axios.get(`/api/assignments/${id}`);
                setAssignment(response.data);

                // Fetch sample data for each source table
                if (response.data.sourceTables && response.data.sourceTables.length > 0) {
                    const dataPromises = response.data.sourceTables.map(async (table) => {
                        try {
                            const tRes = await axios.get(`/api/tables/${table.name}`);
                            return { name: table.name, data: tRes.data };
                        } catch (e) {
                            return { name: table.name, data: null };
                        }
                    });
                    const tableResults = await Promise.all(dataPromises);
                    const newTableData = {};
                    tableResults.forEach(r => {
                        if (r.data) newTableData[r.name] = r.data;
                    });
                    setTableData(newTableData);
                }
            } catch (err) {
                console.error("Error fetching assignment:", err);
            }
        };

        const fetchHistory = async () => {
            if (user) {
                try {
                    const response = await axios.get(`/api/attempts/${id}`);
                    setHistory(response.data);
                } catch (err) {
                    console.error("Error fetching history:", err);
                }
            }
        };

        fetchAssignment();
        fetchHistory();
    }, [id, user]);

    const handleExecute = async () => {
        setLoading(true);
        setError(null);
        setResults(null);
        setExpectedData(null);
        setIsCorrect(null);
        try {
            const response = await axios.post('/api/query/execute', {
                query,
                assignmentId: id
            });
            setResults(response.data.data);
            setExpectedData(response.data.expectedData);
            setIsCorrect(response.data.isSuccessful);

            // Refresh history if user is logged in
            if (user) {
                const histResponse = await axios.get(`/api/attempts/${id}`);
                setHistory(histResponse.data);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Execution failed');
            // Refresh history even on fail to log the failed attempt
            if (user) {
                const histResponse = await axios.get(`/api/attempts/${id}`).catch(() => null);
                if (histResponse) setHistory(histResponse.data);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGetHint = async () => {
        if (!assignment) return;
        try {
            const response = await axios.post('/api/hint', {
                question: assignment.description,
                query: query
            });
            setHint(response.data.hint);
        } catch (err) {
            console.error("Failed to get hint");
        }
    };

    const loadHistoryQuery = (pastQuery) => {
        setQuery(pastQuery);
    };

    if (!assignment) return <div>Loading...</div>;

    return (
        <div className="attempt-layout">
            {/* Sidebar / Question Panel */}
            <div className="attempt-layout__sidebar">
                <button className="btn btn--outline" onClick={() => navigate('/')} style={{ marginBottom: '16px', width: 'max-content' }}>
                    &larr; Back to List
                </button>
                <h2>{assignment.title}</h2>
                <span className={`difficulty difficulty--${assignment.difficulty.toLowerCase()}`}>
                    {assignment.difficulty}
                </span>
                <div style={{ marginTop: '16px', marginBottom: '16px', color: '#ccc' }}>
                    {assignment.description}
                </div>

                <div className="sample-data-viewer" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
                    <h3>Source Tables</h3>
                    {assignment.sourceTables && assignment.sourceTables.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                            {assignment.sourceTables.map((table, tIdx) => (
                                <div key={tIdx} style={{ marginBottom: '20px' }}>
                                    <strong style={{ color: '#69f0ae' }}>Table: {table.name}</strong>
                                    {tableData[table.name] ? (
                                        <div style={{ overflowX: 'auto', marginTop: '8px' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                                                <thead>
                                                    <tr>
                                                        {tableData[table.name].fields.map(f => (
                                                            <th key={f} style={{ borderBottom: '1px solid #444', padding: '4px', color: '#00e5ff' }}>{f}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tableData[table.name].rows.map((row, rIdx) => (
                                                        <tr key={rIdx} style={{ borderBottom: '1px solid #222' }}>
                                                            {tableData[table.name].fields.map(f => (
                                                                <td key={f} style={{ padding: '4px', color: '#ccc' }}>{row[f]}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div style={{ color: '#888', fontSize: '0.8rem', marginTop: '4px' }}>Loading data...</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {assignment.expectedResultSchema && assignment.expectedResultSchema.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                            <strong>Expected Columns:</strong>
                            <ul style={{ marginLeft: '20px', fontSize: '0.85rem' }}>
                                {assignment.expectedResultSchema.map((col, idx) => (
                                    <li key={idx}>{col}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Attempt History Section */}
                {user && history.length > 0 && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <h3>Your Past Attempts</h3>
                        <ul style={{ listStyleType: 'none', padding: 0, maxHeight: '150px', overflowY: 'auto' }}>
                            {history.map((h, i) => (
                                <li key={i} style={{ padding: '8px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                                        {h.isSuccessful ? '✅ ' : '❌ '} {h.query}
                                    </div>
                                    <button className="btn btn--outline" style={{ padding: '2px 6px', fontSize: '0.7rem' }} onClick={() => loadHistoryQuery(h.query)}>
                                        Load
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {hint && (
                    <div style={{ marginTop: '16px', padding: '10px', backgroundColor: 'rgba(0, 229, 255, 0.1)', border: '1px solid #00e5ff', borderRadius: '4px' }}>
                        <strong>Hint:</strong> <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem' }}>{hint}</p>
                    </div>
                )}
                <button className="btn btn--secondary" onClick={handleGetHint} style={{ marginTop: '16px' }}>
                    Get a Hint
                </button>
            </div>

            {/* Main Work Area */}
            <div className="attempt-layout__main">
                <div className="attempt-layout__editor-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3 style={{ margin: 0 }}>SQL Editor</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <label htmlFor="theme-select" style={{ fontSize: '0.85rem', color: '#ccc' }}>Theme:</label>
                            <select
                                id="theme-select"
                                value={editorTheme}
                                onChange={(e) => setEditorTheme(e.target.value)}
                                style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    background: '#222',
                                    color: '#fff',
                                    border: '1px solid #444',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="vs-dark">Dark (Default)</option>
                                <option value="vs">Light</option>
                                <option value="hc-black">High Contrast</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ flex: 1, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', borderRadius: '4px' }}>
                        <Editor
                            height="100%"
                            defaultLanguage="sql"
                            theme={editorTheme}
                            value={query}
                            onChange={(value) => setQuery(value)}
                            options={{ minimap: { enabled: false }, fontSize: 14 }}
                        />
                    </div>
                    <button
                        className="btn btn--execute"
                        onClick={handleExecute}
                        disabled={loading || !query.trim()}
                    >
                        {loading ? 'Executing...' : 'Execute Query'}
                    </button>
                </div>

                <div className="attempt-layout__results-panel">
                    <h3 style={{ marginBottom: '10px' }}>Results</h3>

                    {isCorrect === true && (
                        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'rgba(0, 230, 118, 0.1)', border: '1px solid #00e676', borderRadius: '4px', color: '#00e676' }}>
                            <strong>🎉 Correct!</strong> Your query returned the expected results.
                        </div>
                    )}
                    {isCorrect === false && !error && results && (
                        <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: 'rgba(255, 171, 0, 0.1)', border: '1px solid #ffab00', borderRadius: '4px', color: '#ffab00' }}>
                            <strong>❌ Not quite.</strong> Your query ran successfully, but the results don't match the expected solution. Keep trying!
                        </div>
                    )}

                    {error && <div style={{ marginBottom: '16px', color: '#ff5252', padding: '10px', backgroundColor: 'rgba(255, 82, 82, 0.1)', borderRadius: '4px' }}>{error}</div>}

                    {results && (
                        <div style={{ overflowX: 'auto', marginBottom: expectedData ? '24px' : '0' }}>
                            {expectedData && <h4 style={{ color: '#aaa', marginBottom: '8px', marginTop: '0' }}>Your Output</h4>}
                            {results.rows.length === 0 ? (
                                <p>0 Rows Returned</p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr>
                                            {results.fields.map(field => (
                                                <th key={field} style={{ borderBottom: '1px solid #333', padding: '8px', color: '#00e5ff' }}>{field}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.rows.map((row, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                                                {results.fields.map(field => (
                                                    <td key={field} style={{ padding: '8px', color: '#ddd' }}>{row[field]}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {expectedData && (
                        <div style={{ overflowX: 'auto' }}>
                            <h4 style={{ color: '#aaa', marginBottom: '8px', marginTop: '0' }}>Expected Output</h4>
                            {expectedData.rows.length === 0 ? (
                                <p>0 Rows Expected</p>
                            ) : (
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr>
                                            {expectedData.fields.map(field => (
                                                <th key={`exp-${field}`} style={{ borderBottom: '1px solid #333', padding: '8px', color: '#00e5ff' }}>{field}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expectedData.rows.map((row, i) => (
                                            <tr key={`exp-row-${i}`} style={{ borderBottom: '1px solid #222' }}>
                                                {expectedData.fields.map(field => (
                                                    <td key={`exp-col-${field}`} style={{ padding: '8px', color: '#ddd' }}>{row[field]}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AssignmentAttempt;
