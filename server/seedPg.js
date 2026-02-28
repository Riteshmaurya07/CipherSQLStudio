require('dotenv').config({ path: '.env' });
const { pgPool } = require('./config/db');

const seedPGDatabase = async () => {
    try {
        console.log('Connecting to PostgreSQL to create mock tables...');
        const client = await pgPool.connect();

        // Drop existing tables just in case to start fresh
        console.log('Dropping existing test tables...');
        await client.query(`
            DROP TABLE IF EXISTS orders;
            DROP TABLE IF EXISTS employees;
            DROP TABLE IF EXISTS departments;
            DROP TABLE IF EXISTS users;
        `);

        console.log('Creating tables...');
        // Create Users Table
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100),
                email VARCHAR(100),
                status VARCHAR(50)
            );
        `);

        // Create Orders Table
        await client.query(`
            CREATE TABLE orders (
                id SERIAL PRIMARY KEY,
                customer_id INTEGER,
                amount DECIMAL(10, 2),
                order_date DATE
            );
        `);

        // Create Departments Table
        await client.query(`
            CREATE TABLE departments (
                department_id SERIAL PRIMARY KEY,
                department_name VARCHAR(100)
            );
        `);

        // Create Employees Table
        await client.query(`
            CREATE TABLE employees (
                employee_id SERIAL PRIMARY KEY,
                department_id INTEGER REFERENCES departments(department_id),
                employee_name VARCHAR(100),
                salary DECIMAL(10, 2)
            );
        `);

        console.log('Inserting mock data...');

        // Insert Users
        await client.query(`
            INSERT INTO users (name, email, status) VALUES 
            ('Alice Smith', 'alice@example.com', 'active'),
            ('Bob Jones', 'bob@example.com', 'inactive'),
            ('Charlie Brown', 'charlie@example.com', 'active'),
            ('Diana Prince', 'diana@example.com', 'active');
        `);

        // Insert Orders
        await client.query(`
            INSERT INTO orders (customer_id, amount, order_date) VALUES 
            (1, 45.00, '2023-01-15'),
            (1, 120.50, '2023-02-20'),
            (1, 30.00, '2023-03-05'),
            (2, 200.00, '2023-01-10'),
            (3, 50.00, '2023-04-12'),
            (3, 75.25, '2023-05-18'),
            (3, 100.00, '2023-06-22'),
            (4, 99.99, '2023-07-01');
        `);

        // Insert Departments
        await client.query(`
            INSERT INTO departments (department_name) VALUES 
            ('Engineering'),
            ('Sales'),
            ('Marketing');
        `);

        // Insert Employees
        await client.query(`
            INSERT INTO employees (department_id, employee_name, salary) VALUES 
            (1, 'Eve', 120000),
            (1, 'Frank', 90000),
            (2, 'Grace', 85000),
            (2, 'Heidi', 95000),
            (3, 'Ivan', 70000);
        `);

        console.log('Successfully seeded PostgreSQL Sandbox!');
        client.release();
        process.exit(0);

    } catch (error) {
        console.error('PostgreSQL Seeding Error:', error);
        process.exit(1);
    }
};

seedPGDatabase();
