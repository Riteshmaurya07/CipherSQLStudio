require('dotenv').config({ path: '.env' });
const { pgPool } = require('./config/db');

(async () => {
    try {
        const client = await pgPool.connect();

        const testCases = [
            {
                name: "Exactly Matching Easy Query",
                student: "SELECT id, name, email FROM users WHERE status = 'active';",
                solution: "SELECT id, name, email FROM users WHERE status = 'active'"
            },
            {
                name: "Wrong Column Order",
                student: "SELECT name, email, id FROM users WHERE status = 'active';",
                solution: "SELECT id, name, email FROM users WHERE status = 'active'"
            },
            {
                name: "Selecting Extra Columns",
                student: "SELECT id, name, email, status FROM users WHERE status = 'active';",
                solution: "SELECT id, name, email FROM users WHERE status = 'active'"
            },
            {
                name: "Selecting Too Few Columns",
                student: "SELECT id, name FROM users WHERE status = 'active';",
                solution: "SELECT id, name, email FROM users WHERE status = 'active'"
            },
            {
                name: "Unordered Rows (Matching)",
                student: "SELECT id, amount, order_date FROM orders WHERE order_date > '2023-02-01' ORDER BY id DESC;",
                solution: "SELECT id, amount, order_date FROM orders WHERE order_date > '2023-02-01'"
            },
            {
                name: "Ordered Rows Required (Matching)",
                student: "SELECT department_name, COUNT(employee_id) AS employee_count FROM departments d JOIN employees e ON d.department_id = e.department_id GROUP BY department_name ORDER BY employee_count DESC LIMIT 1;",
                solution: "SELECT d.department_name, COUNT(e.employee_id) AS employee_count FROM departments d JOIN employees e ON d.department_id = e.department_id GROUP BY d.department_name ORDER BY employee_count DESC LIMIT 1"
            }
        ];

        for (const tc of testCases) {
            console.log(`\n--- Testing: ${tc.name} ---`);
            const cleanStudent = tc.student.replace(/;\s*$/, '').trim();
            const r1 = await client.query(cleanStudent);
            const r2 = await client.query(tc.solution);

            let isSuccessful = false;

            const studentFields = r1.fields.map(f => f.name).join(',');
            const expectedFields = r2.fields.map(f => f.name).join(',');

            if (studentFields === expectedFields) {
                if (r1.rows.length === r2.rows.length) {
                    const normalize = (row) => JSON.stringify(Object.keys(row).sort().reduce((obj, key) => {
                        let val = row[key];
                        if (val instanceof Date) {
                            val = val.toISOString();
                        } else if (typeof val === 'number') {
                            val = String(val);
                        }
                        obj[key] = val;
                        return obj;
                    }, {}));

                    let studentStrs = r1.rows.map(normalize);
                    let expectedStrs = r2.rows.map(normalize);

                    if (!tc.solution.toUpperCase().includes('ORDER BY')) {
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

                    if (matches) isSuccessful = true;
                }
            }

            console.log(`Student Fields: ${studentFields}`);
            console.log(`Expected Fields: ${expectedFields}`);
            console.log(`Success Result: ${isSuccessful}`);
        }

        client.release();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
