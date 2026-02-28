import React from 'react';

const ResultsPanel = ({
    isCorrect,
    error,
    results,
    expectedData
}) => {
    return (
        <div className="attempt-layout__results-panel">
            <h3>Results</h3>

            {isCorrect === true && (
                <div className="attempt-layout__results-panel-message attempt-layout__results-panel-message--correct">
                    <strong>🎉 Correct!</strong> Your query returned the expected results.
                </div>
            )}
            {isCorrect === false && !error && results && (
                <div className="attempt-layout__results-panel-message attempt-layout__results-panel-message--incorrect">
                    <strong>❌ Not quite.</strong> Your query ran successfully, but the results don't match the expected solution. Keep trying!
                </div>
            )}

            {error && <div className="attempt-layout__results-panel-message attempt-layout__results-panel-message--error">{error}</div>}

            {results && (
                <div className="attempt-layout__results-panel-table-container">
                    {expectedData && <h4>Your Output</h4>}
                    {results.rows.length === 0 ? (
                        <p className="empty-rows">0 Rows Returned</p>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    {results.fields.map(field => (
                                        <th key={field}>{field}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {results.rows.map((row, i) => (
                                    <tr key={i}>
                                        {results.fields.map(field => (
                                            <td key={field}>{row[field]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {expectedData && (
                <div className="attempt-layout__results-panel-table-container">
                    <h4>Expected Output</h4>
                    {expectedData.rows.length === 0 ? (
                        <p className="empty-rows">0 Rows Expected</p>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    {expectedData.fields.map(field => (
                                        <th key={`exp-${field}`}>{field}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {expectedData.rows.map((row, i) => (
                                    <tr key={`exp-row-${i}`}>
                                        {expectedData.fields.map(field => (
                                            <td key={`exp-col-${field}`}>{row[field]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResultsPanel;
