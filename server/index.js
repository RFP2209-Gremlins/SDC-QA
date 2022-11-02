const dotenv = require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const router = require('./routes.js')
const db = require('./db')

app.use(express.json());
app.use(express.urlencoded({ extended: true} ));
app.use('/', router)

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
})