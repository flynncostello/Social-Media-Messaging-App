require('dotenv').config();
const supabase = require('./services/supabaseDatabaseService');

console.log(supabase.rest.url);
module.exports = {
  client: 'pg',
  connection: supabase.rest.url,
  pool: {
    min: 2,
    max: 200
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};