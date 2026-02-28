import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useAssignmentManager = (id, user) => {
    const [assignment, setAssignment] = useState(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [expectedData, setExpectedData] = useState(null);
    const [error, setError] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [hint, setHint] = useState('');
    const [isHintLoading, setIsHintLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [tableData, setTableData] = useState({});

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await axios.get(`/api/assignments/${id}`);
                setAssignment(response.data);

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

    const handleExecute = useCallback(async () => {
        setLoading(true);
        setError(null);
        setResults(null);
        setExpectedData(null);
        setIsCorrect(null);
        try {
            const response = await axios.post('/api/query/execute', { query, assignmentId: id });
            setResults(response.data.data);
            setExpectedData(response.data.expectedData);
            setIsCorrect(response.data.isSuccessful);

            if (user) {
                const histResponse = await axios.get(`/api/attempts/${id}`);
                setHistory(histResponse.data);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Execution failed');
            if (user) {
                const histResponse = await axios.get(`/api/attempts/${id}`).catch(() => null);
                if (histResponse) setHistory(histResponse.data);
            }
        } finally {
            setLoading(false);
        }
    }, [id, query, user]);

    const handleGetHint = useCallback(async () => {
        if (!assignment) return;
        setIsHintLoading(true);
        try {
            const response = await axios.post('/api/hint', { question: assignment.description, query });
            setHint(response.data.hint);
        } catch (err) {
            console.error("Failed to get hint", err);
            setHint("Oops! Couldn't load a hint. Try to think about which tables to JOIN or what WHERE condition to apply.");
        } finally {
            setIsHintLoading(false);
        }
    }, [assignment, query]);

    const loadHistoryQuery = useCallback((pastQuery) => {
        setQuery(pastQuery);
    }, []);

    return {
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
    };
};
