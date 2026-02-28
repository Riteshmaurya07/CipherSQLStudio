import React from 'react';
import Editor from '@monaco-editor/react';

const EditorPanel = ({
    editorTheme,
    setEditorTheme,
    query,
    setQuery,
    loading,
    handleExecute
}) => {
    return (
        <div className="attempt-layout__editor-panel">
            <div className="attempt-layout__editor-panel-header">
                <h3>SQL Editor</h3>
                <div className="theme-selector">
                    <label htmlFor="theme-select">Theme:</label>
                    <select
                        id="theme-select"
                        value={editorTheme}
                        onChange={(e) => setEditorTheme(e.target.value)}
                    >
                        <option value="vs-dark">Dark (Default)</option>
                        <option value="vs">Light</option>
                        <option value="hc-black">High Contrast</option>
                    </select>
                </div>
            </div>
            <div className="attempt-layout__editor-panel-container">
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
    );
};

export default EditorPanel;
