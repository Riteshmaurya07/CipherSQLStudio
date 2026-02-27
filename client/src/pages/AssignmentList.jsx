import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ProgressIndicator from '../components/ProgressIndicator';

const AssignmentList = () => {
    const [assignments, setAssignments] = useState([]);
    const [stats, setStats] = useState(null);
    const [solvedIds, setSolvedIds] = useState([]);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await axios.get('/api/assignments');
                setAssignments(response.data);
            } catch (error) {
                console.error("Failed to fetch assignments", error);
            }
        };

        const fetchStats = async () => {
            if (user) {
                try {
                    const response = await axios.get('/api/attempts/stats');
                    setStats(response.data.stats);
                    setSolvedIds(response.data.solvedIds);
                } catch (error) {
                    console.error("Failed to fetch user stats", error);
                }
            } else {
                setStats(null);
                setSolvedIds([]);
            }
        };

        fetchAssignments();
        fetchStats();
    }, [user]);

    return (
        <div className="assignment-list">
            <div className="assignment-list__header">
                <h1>CipherSQL Studio</h1>
                <p>Select an assignment to begin your SQL journey.</p>
            </div>

            {user && <ProgressIndicator stats={stats} />}

            <div className="assignment-list__grid">
                {assignments.length > 0 ? assignments.map(assignment => {
                    const isSolved = solvedIds.includes(assignment._id);
                    return (
                        <div
                            key={assignment._id}
                            className="assignment-list__card"
                            onClick={() => navigate(`/assignment/${assignment._id}`)}
                            style={{ position: 'relative' }}
                        >
                            {isSolved && (
                                <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.2rem' }} title="Solved">
                                    ✅
                                </div>
                            )}
                            <h3 style={{ paddingRight: '24px' }}>{assignment.title}</h3>
                            <p>{assignment.description}</p>
                            <span className={`difficulty difficulty--${assignment.difficulty.toLowerCase()}`}>
                                {assignment.difficulty}
                            </span>
                        </div>
                    );
                }) : (
                    <p>No assignments available at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default AssignmentList;
