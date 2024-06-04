const express = require('express');
const mongoose = require('mongoose');
const connect = require('./models/Main.js');
const bodyParser = require('body-parser');
const cors = require('cors');

const Ctest = require('./controllers/Ctest.js');

const app = express();
const port = 3000;

connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('start!');
});

app.post('/', Ctest.testWrite);

app.listen(port, () => {
  console.log(`localhost:${port} open`);
});
