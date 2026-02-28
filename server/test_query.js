require('dotenv').config({ path: '.env' });
const { pgPool } = require('./config/db');

(async () => {
    try {
        const client = await pgPool.connect();

        const cleanQuery1 = "SELECT id, name, email FROM users WHERE status = 'active';".replace(/;\s*$/, '').trim();
        const solutionQuery1 = "SELECT id, name, email FROM users WHERE status = 'active'";

        const result = await client.query(cleanQuery1);
        const solutionResult = await client.query(solutionQuery1);

        const normalize = (row) => JSON.stringify(Object.keys(row).sort().reduce((obj, key) => {
            let val = row[key];
            if (val instanceof Date) val = val.toISOString();
            else if (typeof val === 'number') val = String(val);
            obj[key] = val;
            return obj;
        }, {}));

        let studentStrs = result.rows.map(normalize);
        let expectedStrs = solutionResult.rows.map(normalize);

        console.log('Fields match?', JSON.stringify(result.fields.map(f => f.name)) === JSON.stringify(solutionResult.fields.map(f => f.name)));
        console.log('Result length:', result.rows.length, solutionResult.rows.length);
        console.log('Student:', studentStrs);
        console.log('Expected:', expectedStrs);

        client.release();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
