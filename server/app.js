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
    cookie: {maxAge: 60000}, //that is one min
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(path.resolve(__dirname, '../client/dist')));

app.get('/home', (req, res) => {
  if(req.session.loggedin) {
    res.status(200).send(req.session.user_id);
    } else {
    res.send('Please login');
    }
  res.end();
})

app.get('/messages', async (req, res) => {
  if(req.session.loggedin) {
    let order_number = Number(req.query.order_number);
    try {
      let order_messages = await db.scb.query(aql`FOR m IN messages FILTER m.order_number == ${order_number} RETURN m`);
      let messages = await order_messages.all();
      res.send(messages);
    } catch (err) {
      console.log(err);
      res.status(404).send(err);
    }
  }
})

app.post('/messages', async (req, res) => {
  if(req.session.loggedin) {
    let new_note = req.body;
    try {
      await db.Messages.save(new_note)
        .then(doc => {
          console.log('doc._key', doc._key);
          res.status(201).send("Inserted doc with key value of: " + doc._key);
        },
        err => {res.status(400).send("Document not inserted - " + err.message)})
    } catch (err) {
      console.log(err);
      res.status(404).send(err);
    }
  }
})

app.get('/orders', async (req, res) => {
  if(req.session.loggedin) {
    let user_id = Number(req.query.user_id);
    try {
      let pos_orders = await db.scb.query(aql`FOR po IN orders FILTER po.customer_id == ${user_id} RETURN po`);
      let pos = await pos_orders.all();
      let cos_orders = await db.scb.query(aql`FOR co IN orders FILTER co.vendor_id == ${user_id} RETURN co`);
      let cos = await cos_orders.all();
      res.send({
        purchase_orders: pos,
        customer_orders: cos,
      })
    } catch (err) {
      console.log(err);
      res.status(404).send(err);
    }
  }
})

app.get('/partners', async (req, res) => {
  if(req.session.loggedin) {
    let user_id = Number(req.query.user_id);
    console.log('user_id at app.get ', req.query.user_id);
    try {
        let customers = await db.scb.query(aql`FOR d IN partners FILTER d.supplier_id == ${user_id} RETURN d`);
        let my_customers = await customers.all();
        let suppliers = await db.scb.query(aql`FOR d IN partners FILTER d.customer_id == ${user_id} RETURN d`);
        let my_suppliers = await suppliers.all();
        res.send({
          customers: my_customers,
          suppliers: my_suppliers,
        })
    } catch (err) {
      console.log(err);
      res.status(404).send(err);
    }
  }
})

app.post('/login', async (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  try {
    let account = await db.scb.query(aql`FOR d IN accounts FILTER d.username == ${username} AND d.password == ${password} RETURN d`);
    let user = await account.all();
    if (user[0].user_id > 0) {
    req.session.loggedin = true;
    req.session.username = username;
    req.session.user_id = [user[0].user_id];
    res.redirect('/home');
    } else {
    res.send('Incorrect Username and/or Password!');
    }
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
})

app.post('/signup', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  res.send('WIP')
})

module.exports = app;