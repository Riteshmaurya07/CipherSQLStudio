require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Assignment = require('./models/Assignment');

const initialAssignments = [
    {
        title: 'Basic Users Table Query',
        difficulty: 'Easy',
        description: 'Write a query to select all active users from the `users` table where the `status` is set to "active". Return the user `id`, `name`, and `email`.',
        expectedResultSchema: ['id', 'name', 'email'],
        sourceTables: [
            { name: 'users', columns: ['id (INT)', 'name (VARCHAR)', 'email (VARCHAR)', 'status (VARCHAR)'] }
        ],
        setupQuery: '',
        solutionQuery: "SELECT id, name, email FROM users WHERE status = 'active'"
    },
    {
        title: 'Employees in Engineering',
        difficulty: 'Easy',
        description: 'Find all employees who work in the Engineering department (where department_id = 1). Return their `employee_name` and `salary`.',
        expectedResultSchema: ['employee_name', 'salary'],
        sourceTables: [
            { name: 'employees', columns: ['employee_id (INT)', 'department_id (INT)', 'employee_name (VARCHAR)', 'salary (DECIMAL)'] },
            { name: 'departments', columns: ['department_id (INT)', 'department_name (VARCHAR)'] }
        ],
        setupQuery: '',
        solutionQuery: "SELECT employee_name, salary FROM employees WHERE department_id = 1"
    },
    {
        title: 'Orders per Customer',
        difficulty: 'Medium',
        description: 'Find the total number of orders placed by each customer. Your result should have `customer_id` and a column named `total_orders`. Only include customers who have placed more than 2 orders.',
        expectedResultSchema: ['customer_id', 'total_orders'],
        sourceTables: [
            { name: 'orders', columns: ['id (INT)', 'customer_id (INT)', 'amount (DECIMAL)', 'order_date (DATE)'] },
            { name: 'users', columns: ['id (INT)', 'name (VARCHAR)', 'email (VARCHAR)', 'status (VARCHAR)'] }
        ],
        setupQuery: '',
        solutionQuery: "SELECT customer_id, COUNT(*) AS total_orders FROM orders GROUP BY customer_id HAVING COUNT(*) > 2"
    },
    {
        title: 'Department Salary Expenditure',
        difficulty: 'Medium',
        description: 'Calculate the total salary expenditure for each department. Return `department_id` and a column named `total_spending`. Order the results by `total_spending` descending.',
        expectedResultSchema: ['department_id', 'total_spending'],
        sourceTables: [
            { name: 'employees', columns: ['employee_id (INT)', 'department_id (INT)', 'employee_name (VARCHAR)', 'salary (DECIMAL)'] },
            { name: 'departments', columns: ['department_id (INT)', 'department_name (VARCHAR)'] }
        ],
        setupQuery: '',
        solutionQuery: "SELECT department_id, SUM(salary) AS total_spending FROM employees GROUP BY department_id ORDER BY total_spending DESC"
    },
    {
        title: 'Top Earning Employees',
        difficulty: 'Hard',
        description: 'List the names of employees who earn more than the average salary of their respective departments. Return the `department_id`, `employee_name`, and `salary`. Order the results by `department_id` ascending, then by `salary` descending.',
        expectedResultSchema: ['department_id', 'employee_name', 'salary'],
        sourceTables: [
            { name: 'employees', columns: ['employee_id (INT)', 'department_id (INT)', 'employee_name (VARCHAR)', 'salary (DECIMAL)'] },
            { name: 'departments', columns: ['department_id (INT)', 'department_name (VARCHAR)'] }
        ],
        setupQuery: '',
        solutionQuery: "SELECT e.department_id, e.employee_name, e.salary FROM employees e INNER JOIN (SELECT department_id, AVG(salary) as avg_salary FROM employees GROUP BY department_id) avg_dept ON e.department_id = avg_dept.department_id WHERE e.salary > avg_dept.avg_salary ORDER BY e.department_id ASC, e.salary DESC"
    },
    {
        title: 'Second Highest Salary',
        difficulty: 'Hard',
        description: 'Find the employee with the second highest salary across all departments. Return their `employee_name` and `salary`.',
        expectedResultSchema: ['employee_name', 'salary'],
        sourceTables: [
            { name: 'employees', columns: ['employee_id (INT)', 'department_id (INT)', 'employee_name (VARCHAR)', 'salary (DECIMAL)'] }
        ],
        setupQuery: '',
        solutionQuery: "SELECT employee_name, salary FROM employees ORDER BY salary DESC OFFSET 1 LIMIT 1"
    },
    {
        title: 'Count Users by Status',
        difficulty: 'Easy',
        description: 'Count how many users there are for each status in the `users` table. Return the `status` and `user_count`.',
        expectedResultSchema: ['status', 'user_count'],
        sourceTables: [
            { name: 'users', columns: ['id (INT)', 'name (VARCHAR)', 'email (VARCHAR)', 'status (VARCHAR)'] }
        ],
        setupQuery: '',
        solutionQuery: "SELECT status, COUNT(*) AS user_count FROM users GROUP BY status"
    },
    {
        title: 'Recent Orders',
        difficulty: 'Easy',
        description: 'Retrieve all orders placed after February 1st, 2023. Return the `id`, `amount`, and `order_date`.',
        expectedResultSchema: ['id', 'amount', 'order_date'],
        sourceTables: [
            { name: 'orders', columns: ['id (INT)', 'customer_id (INT)', 'amount (DECIMAL)', 'order_date (DATE)'] }
        ],
        setupQuery: '',
        solutionQuery: "SELECT id, amount, order_date FROM orders WHERE order_date > '2023-02-01'"
    },
    {
        title: 'Total Revenue by Customer',
        difficulty: 'Medium',
        description: 'Calculate the total amount spent by each customer across all their orders. Return the `customer_id` and `total_spent`. Sort the results descending by total spent.',
        expectedResultSchema: ['customer_id', 'total_spent'],
        sourceTables: [
            { name: 'orders', columns: ['id (INT)', 'customer_id (INT)', 'amount (DECIMAL)', 'order_date (DATE)'] }
        ],
        setupQuery: '',
        solutionQuery: "SELECT customer_id, SUM(amount) AS total_spent FROM orders GROUP BY customer_id ORDER BY total_spent DESC"
    },
    {
        title: 'Employees Without Orders',
        difficulty: 'Medium',
        description: 'Assuming users and customers are the same based on ID, find the names of users who have NEVER placed an order. Return their `id` and `name`.',
        expectedResultSchema: ['id', 'name'],
        sourceTables: [
            { name: 'users', columns: ['id (INT)', 'name (VARCHAR)', 'email (VARCHAR)', 'status (VARCHAR)'] },
            { name: 'orders', columns: ['id (INT)', 'customer_id (INT)', 'amount (DECIMAL)', 'order_date (DATE)'] }
        ],
        setupQuery: '',
        solutionQuery: "SELECT u.id, u.name FROM users u LEFT JOIN orders o ON u.id = o.customer_id WHERE o.id IS NULL"
    },
    {
        title: 'High Value Customers',
        difficulty: 'Hard',
        description: 'Find the names of customers (users) who have an average order value strictly greater than $80. Return their `name` and `average_order`.',
        expectedResultSchema: ['name', 'average_order'],
        sourceTables: [
            { name: 'users', columns: ['id (INT)', 'name (VARCHAR)', 'email (VARCHAR)', 'status (VARCHAR)'] },
            { name: 'orders', columns: ['id (INT)', 'customer_id (INT)', 'amount (DECIMAL)', 'order_date (DATE)'] }
        ],
        setupQuery: '',
        solutionQuery: "SELECT u.name, AVG(o.amount) AS average_order FROM users u JOIN orders o ON u.id = o.customer_id GROUP BY u.name HAVING AVG(o.amount) > 80"
    },
    {
        title: 'Department with Most Employees',
        difficulty: 'Hard',
        description: 'Find the name of the department that has the single highest number of employees. Return just the `department_name` and the `employee_count`.',
        expectedResultSchema: ['department_name', 'employee_count'],
        sourceTables: [
            { name: 'employees', columns: ['employee_id (INT)', 'department_id (INT)', 'employee_name (VARCHAR)', 'salary (DECIMAL)'] },
            { name: 'departments', columns: ['department_id (INT)', 'department_name (VARCHAR)'] }
        ],
        setupQuery: '',
        solutionQuery: "SELECT d.department_name, COUNT(e.employee_id) AS employee_count FROM departments d JOIN employees e ON d.department_id = e.department_id GROUP BY d.department_name ORDER BY employee_count DESC LIMIT 1"
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing assignments to avoid duplicates on multiple runs
        await Assignment.deleteMany({});
        console.log('Cleared existing assignments.');

        // Insert new data
        await Assignment.insertMany(initialAssignments);
        console.log('Successfully seeded assignments!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
