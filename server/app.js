const path = require('path');
const express = require('express');
var session = require('express-session');
const models = require('./models');
const bodyParser = require('body-parser');
const db = require('../database');
const { aql } = require('arangojs/lib');

const app = express();
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    // cookie: {maxAge: 60000}, //that is one min
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(path.resolve(__dirname, '../client/dist')));

app.get('/', (req, res) => {
    res.status(200).send('received');
})

app.post('/login', async (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    console.log('/login username', username);
    console.log('/login password', password);
    try {
      let account = await db.scb.query(aql`FOR d IN accounts FILTER d.username == ${username} AND d.password == ${password} RETURN d.user_id`);
      let user_id = await account.all();
      console.log(user_id);
      res.send({user_id: user_id, username: username});
    } catch (err) {
      console.log(err);
      res.status(404).send(err);
    }
    // if (username && password) {
    //     db.scb.query({
    //         query: "FOR d in @c FILTER d.username == @u AND d.password == @p RETURN d",
    //         bindVars: { c: db.Accounts, u: username, p: password },
    //     })
    //       .then((cursor) => {
    //           console.log('this is cursor: ', cursor);
    //           res.send(cursor);
    //         //   return cursor;
    //           return cursor.forEach((id) => {
    //             console.log('this is id: ', id);
    //           })
    //       })
    //       .catch((err) => {
    //         console.log(err);
    //         res.send(err);
    //       })
    // }
})

app.post('/signup', (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    res.send('WIP')
})

module.exports = app;