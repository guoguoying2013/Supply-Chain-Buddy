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

app.get('/history', async (req, res) => {
  if(req.session.loggedin) {
    let suppliers = req.query.suppliers;
    let result = [];
    try {
      for (let i = 0; i < suppliers.length; i++) {
        let vendor_id = JSON.parse(suppliers[i])[1];
        let vendor_name = JSON.parse(suppliers[i])[0];
        if (req.session.user_id[0] !== vendor_id) {
          let history = await db.scb.query(aql`FOR po IN orders FILTER po.customer_id == ${req.session.user_id[0]} FILTER po.status == 'closed' FILTER po.vendor_id == ${vendor_id} RETURN po`);
          let orderHistory = await history.all();
          result.push([vendor_name, orderHistory]);
        }
      }
      let sumTotal = await db.scb.query(aql`
      FOR doc IN orders
      COLLECT group = (doc.vendor_id == 2 ? "Crispy Bakery" : 
                      (doc.vendor_id == 3 ? "Sunny Farm" : 
                      (doc.vendor_id == 4 ?  "Meet Fresh" : "other" )))
      AGGREGATE s = SUM(doc.total)
      RETURN { group, s }
      `)
      let sumTotalRes = await sumTotal.all();
      console.log(sumTotalRes);
      res.send({
        orderHistory: result,
        sumByVendors: sumTotalRes,
      })
    } catch (err) {
      console.log(err);
      res.status(404).send(err);
    }
  }
});

app.get('/orders', async (req, res) => {
  if(req.session.loggedin) {
    let user_id = Number(req.query.user_id);
    try {
      let pos_orders = await db.scb.query(aql`FOR po IN orders FILTER po.customer_id == ${user_id} AND po.status != 'closed' RETURN po`);
      let pos = await pos_orders.all();
      let cos_orders = await db.scb.query(aql`FOR co IN orders FILTER co.vendor_id == ${user_id} AND co.status != 'closed' RETURN co`);
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
});

app.post('/orders', async (req, res) => {
  if(req.session.loggedin) {
    let new_message = req.body;
    console.log('new_message: ', new_message);
    try {
      await db.Orders.save(new_message)
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

app.get('/partners', async (req, res) => {
  if(req.session.loggedin) {
    let user_id = Number(req.query.user_id);
    console.log('user_id at app.get ', req.query.user_id);
    try {
        let customers = await db.scb.query(aql`FOR d IN partners FILTER d.vendor_id == ${user_id} RETURN d`);
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

app.get('/user', async (req, res) => {
  if(req.session.loggedin) {
    let user_id = Number(req.query.user_id);
    console.log('user_id at app.get/user ', req.query.user_id);
    try {
        let customers = await db.scb.query(aql`FOR d IN accounts FILTER d.user_id == ${user_id} RETURN d`);
        let you = await customers.all();
        res.send(you);
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