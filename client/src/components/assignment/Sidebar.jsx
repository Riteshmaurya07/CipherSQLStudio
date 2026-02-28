import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({
    assignment,
    tableData,
    user,
    history,
    hint,
    isHintLoading,
    handleGetHint,
    loadHistoryQuery
}) => {
    const navigate = useNavigate();

    return (
        <div className="attempt-layout__sidebar">
            <button className="btn btn--outline back-btn" onClick={() => navigate('/')}>
                &larr; Back to List
            </button>
            <h2>{assignment.title}</h2>
            <span className={`difficulty difficulty--${assignment.difficulty.toLowerCase()}`}>
                {assignment.difficulty}
            </span>
            <div className="description">
                {assignment.description}
            </div>

            <div className="source-tables">
                <h3>Source Tables</h3>
                {assignment.sourceTables && assignment.sourceTables.length > 0 && (
                    <div>
                        {assignment.sourceTables.map((table, tIdx) => (
                            <div key={tIdx} className="source-tables__table-wrapper">
                                <span className="table-name">Table: {table.name}</span>
                                {tableData[table.name] ? (
                                    <div className="table-data">
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    {tableData[table.name].fields.map(f => (
                                                        <th key={f}>{f}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableData[table.name].rows.map((row, rIdx) => (
                                                    <tr key={rIdx}>
                                                        {tableData[table.name].fields.map(f => (
                                                            <td key={f}>{row[f]}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="loading">Loading data...</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {assignment.expectedResultSchema && assignment.expectedResultSchema.length > 0 && (
                    <div className="source-tables__expected-schema">
                        <strong>Expected Columns:</strong>
                        <ul>
                            {assignment.expectedResultSchema.map((col, idx) => (
                                <li key={idx}>{col}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {user && history.length > 0 && (
                <div className="history-section">
                    <h3>Your Past Attempts</h3>
                    <ul className="history-section__list">
                        {history.map((h, i) => (
                            <li key={i}>
                                <div className="query-text" title={h.query}>
                                    {h.isSuccessful ? '✅ ' : '❌ '} {h.query}
                                </div>
                                <button className="btn btn--outline btn--small" onClick={() => loadHistoryQuery(h.query)}>
                                    Load
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {hint && (
                <div className="hint-box">
                    <strong>Hint</strong> <p>{hint}</p>
                </div>
            )}
            <button
                className="btn btn--secondary"
                onClick={handleGetHint}
                disabled={isHintLoading}
                style={{ marginTop: '16px' }}
            >
                {isHintLoading ? 'Loading Hint...' : 'Get a Hint'}
            </button>
        </div>
    );
};

export default Sidebar;
