// require("dotenv").config(); // Comment out or remove this line, as Render doesn't use a local .env file

const { Pool } = require('pg');

const pool = new Pool({ // create connection to database
  connectionString: process.env.DATABASE_URL,	// use DATABASE_URL environment variable from Render app 
  ssl: {
    rejectUnauthorized: false // don't check for SSL cert
  }
});

module.exports = pool;
