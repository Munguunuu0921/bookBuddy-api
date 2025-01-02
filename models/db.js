const { Pool } = require('pg');

// Database connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'BookBuddy',
  password: 'Mungu@99380403',
  port: 5432, // default PostgreSQL port
});

module.exports = pool;  // Export the pool instance
