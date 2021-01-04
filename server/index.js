const PORT = 3000;
const app = require('./app.js');
const db = require('../database');


app.listen(PORT, () => {
    console.log(`Supply Chain Buddy is running on localhost:${PORT}`);
});