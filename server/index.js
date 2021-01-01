const PORT = 3000;
const app = require('./app.js');
// const path = require('path');
// const express = require('express');
const db = require('../database');

// const app = express();
// app.use('/', express.static(path.resolve(__dirname, '../client/dist')));

// app.get('/', (req, res) => {
//     res.send('received');
// })

app.listen(PORT, () => {
    console.log(`Supply Chain Buddy is running on localhost:${PORT}`);
});