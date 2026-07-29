const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

// dotenv.config({path: '.env'})
dotenv.config({ path: '/custom/path/.env' })

// Create the connection pool. The pool-specific settings are the defaults
module.exports.pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password:  process.env.DB_PASS,
  port: Number(process.env.DB_PORT), 
  waitForConnections: true,
  connectTimeout: 20000,   // increase timeout to 10s
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});