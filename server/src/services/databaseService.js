// require("dotenv").config();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Only set this to false in a development environment
  },
});

module.exports = pool;
