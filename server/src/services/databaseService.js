// require("dotenv").config(); // Comment out or remove this line, as Render doesn't use a local .env file

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Only set this to false in a development environment
  },
});

module.exports = pool;
