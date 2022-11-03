const { Pool } = require('pg');
const dotenv = require('dotenv').config()

const db = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.PW,
  port: process.env.dbPORT
});

module.exports = db
