const { Pool } = require('pg');
const mongoose = require('mongoose');

// PostgreSQL Connection
const pgPool = new Pool({
  connectionString: process.env.PG_URI,
  ssl: {
    rejectUnauthorized: false
  }
});

const connectPG = async () => {
  try {
    await pgPool.connect();
    console.log('PostgreSQL Connected');
  } catch (error) {
    console.error('PostgreSQL Connection Error:', error);
  }
};

// MongoDB Connection
const connectMongo = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
  }
};

module.exports = { pgPool, connectPG, connectMongo };
