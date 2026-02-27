const { pgPool } = require('../config/db');
const Attempt = require('../models/Attempt');
const Assignment = require('../models/Assignment');

exports.executeQuery = async (req, res) => {
    const { query, assignmentId } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query is missing' });
    }

    // Remove trailing semicolons and whitespace for validation
    const cleanQuery = query.replace(/;\s*$/, '').trim();

    // 1. Validate multiple statements restriction (after removing trailing semicolon)
    if (cleanQuery.includes(';')) {
        // Basic check for semi-colon presence inside the query
        // In a real app we'd parse the SQL properly to ignore semicolons in string literals
        return res.status(400).json({ error: 'Multiple statements are not allowed.' });
    }

    const trimmedQuery = cleanQuery.toUpperCase();

    // 2. Validate SELECT only restriction
    if (!trimmedQuery.startsWith('SELECT')) {
        return res.status(400).json({ error: 'Only SELECT statements are allowed. Modifying data or schema is forbidden.' });
    }

    const client = await pgPool.connect();
    let resultData = null;
    let expectedData = null;
    let isSuccessful = false;
    let errorMessage = null;

    try {
        // 3. Set read-only transaction and timeout
        await client.query('BEGIN READ ONLY');
        await client.query('SET LOCAL statement_timeout = \'5s\'');

        const result = await client.query(cleanQuery);
        resultData = {
            fields: result.fields.map(f => f.name),
            rows: result.rows
        };

        // Default to false. Only true if it matches the solution.
        isSuccessful = false;

        if (assignmentId) {
            const assignment = await Assignment.findById(assignmentId);
            if (assignment && assignment.solutionQuery) {
                try {
                    const solutionResult = await client.query(assignment.solutionQuery);

                    expectedData = {
                        fields: solutionResult.fields.map(f => f.name),
                        rows: solutionResult.rows
                    };

                    // 1. First check if they returned the wrong columns
                    const studentFields = result.fields.map(f => f.name).join(',');
                    const expectedFields = solutionResult.fields.map(f => f.name).join(',');

                    if (studentFields === expectedFields) {
                        // 2. Then check if they returned the wrong number of rows
                        if (result.rows.length === solutionResult.rows.length) {
                            const normalize = (row) => JSON.stringify(Object.keys(row).sort().reduce((obj, key) => {
                                let val = row[key];
                                // Standardize Dates to ISO strings before stringifying to avoid timezone formatting quirks
                                if (val instanceof Date) {
                                    val = val.toISOString();
                                } else if (typeof val === 'number') {
                                    // Standardize numeric types to strings to avoid '100.00' vs 100 mismatches
                                    val = String(val);
                                }
                                obj[key] = val;
                                return obj;
                            }, {}));

                            // We only enforce ORDER BY if the solution query explicitly requires it
                            let studentStrs = result.rows.map(normalize);
                            let expectedStrs = solutionResult.rows.map(normalize);

                            if (!assignment.solutionQuery.toUpperCase().includes('ORDER BY')) {
                                studentStrs = studentStrs.sort();
                                expectedStrs = expectedStrs.sort();
                            }

                            let matches = true;
                            for (let i = 0; i < studentStrs.length; i++) {
                                if (studentStrs[i] !== expectedStrs[i]) {
                                    matches = false;
                                    break;
                                }
                            }

                            if (matches) {
                                isSuccessful = true;
                            }
                        }
                    }
                } catch (solErr) {
                    console.error("Error running solution query:", solErr);
                }
            }
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        errorMessage = error.message;
    } finally {
        client.release();
    }

    // Optional: Extract user from JWT if provided in headers to attach to attempt
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const jwt = require('jsonwebtoken');
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            userId = decoded.id;
        } catch (e) {
            console.error('JWT verification failed in queryController:', e.message);
        }
    }

    // Save attempt to mongo
    try {
        if (assignmentId) {
            await Attempt.create({
                assignmentId,
                userId,
                query,
                isSuccessful,
                errorMessage
            });
        }
    } catch (mongoError) {
        console.error('Failed to log attempt in MongoDB:', mongoError.message);
    }

    if (errorMessage) {
        return res.status(400).json({ error: errorMessage });
    }

    res.json({ data: resultData, isSuccessful, expectedData });
};

exports.getTableData = async (req, res) => {
    const { tableName } = req.params;

    // Validate table name to prevent SQL injection
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
        return res.status(400).json({ error: 'Invalid table name' });
    }

    const client = await pgPool.connect();
    try {
        await client.query('BEGIN READ ONLY');
        const result = await client.query(`SELECT * FROM ${tableName} LIMIT 100`);
        await client.query('COMMIT');

        res.json({
            table: tableName,
            fields: result.fields.map(f => f.name),
            rows: result.rows
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(`Error fetching table ${tableName}:`, error);
        res.status(500).json({ error: 'Failed to fetch table data' });
    } finally {
        client.release();
    }
};
