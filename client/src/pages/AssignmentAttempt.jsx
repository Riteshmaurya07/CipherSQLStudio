import React, { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useAssignmentManager } from '../hooks/useAssignmentManager';
import Sidebar from '../components/assignment/Sidebar';
import EditorPanel from '../components/assignment/EditorPanel';
import ResultsPanel from '../components/assignment/ResultsPanel';

const AssignmentAttempt = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [editorTheme, setEditorTheme] = useState('vs-dark');

    const {
        assignment,
        query,
        setQuery,
        results,
        expectedData,
        error,
        isCorrect,
        hint,
        isHintLoading,
        loading,
        history,
        tableData,
        handleExecute,
        handleGetHint,
        loadHistoryQuery
    } = useAssignmentManager(id, user);

    if (!assignment) return <div>Loading...</div>;

    return (
        <div className="attempt-layout">
            <Sidebar
                assignment={assignment}
                tableData={tableData}
                user={user}
                history={history}
                hint={hint}
                isHintLoading={isHintLoading}
                handleGetHint={handleGetHint}
                loadHistoryQuery={loadHistoryQuery}
            />

            <div className="attempt-layout__main">
                <EditorPanel
                    editorTheme={editorTheme}
                    setEditorTheme={setEditorTheme}
                    query={query}
                    setQuery={setQuery}
                    loading={loading}
                    handleExecute={handleExecute}
                />

                <ResultsPanel
                    isCorrect={isCorrect}
                    error={error}
                    results={results}
                    expectedData={expectedData}
                />
            </div>
        </div>
    );
};

export default AssignmentAttempt;
