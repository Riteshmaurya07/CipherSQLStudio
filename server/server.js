require('dotenv').config({ path: '.env' }); // Load from root
const express = require('express');
const cors = require('cors');
const { connectMongo, connectPG } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

const frontendUri = process.env.FRONTEND_URI?.replace(/\/$/, "");
app.use(cors({
  origin: [
    "http://localhost:5173",
    frontendUri
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', require('./routes/api'));

// Initialize Server
const startServer = async () => {
  await connectMongo();
  await connectPG();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
