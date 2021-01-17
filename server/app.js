const path = require('path');
const express = require('express');
const session = require('express-session');
const models = require('./models');
const controllers = require('./controllers');
const bodyParser = require('body-parser');
const db = require('../database');
const { aql } = require('arangojs/lib');

// salty and hash password.

// take control code to controler directory, MVC pattern.
// view: info sending back to client
// controller: trigered by the view

const app = express();

const isLoginMiddleware = (req, res, next) => {
  if (req.session.loggedin) {
    next();
  } else {
    console.log('user is not login');
    res.send('user is not login');
  }
};

app.use(session({
  secret: 'secret', // should be requiqred from another file, that file should be gitignored. 
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 30000 }, //60000that is one min //refresh the coocki
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(path.resolve(__dirname, '../client/dist')));
app.use('/api', isLoginMiddleware);

app.get('/api/home', (req, res) => {
  if (req.session.loggedin) {
    res.status(200).send(req.session.user_id);
  } else {
    res.send('Please login');
  }
  res.end();
});

app.get('/api/orders', async (req, res) => {
  const userId = Number(req.query.user_id);
  res.send(await models.orders(userId));
});

// async function, req, res , controller: the entire error function
app.get('/api/messages', async (req, res) => {
  let order_number = Number(req.query.order_number);
  try {
    let order_messages = await db.scb.query(aql`FOR m IN messages FILTER m.order_number == ${order_number} RETURN m`); // model method
    const messages = await order_messages.all(); // model method, function communication with database
    res.send(messages); // this is view method, info sending back is the view.
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
});

app.post('/api/messages', async (req, res) => {
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
  } else {
    console.log('req.session.loggedin is false', req.session.loggedin);
  }
});

app.get('/api/history', async (req, res) => {
  if(req.session.loggedin) {
    let suppliers = req.query.suppliers;
    let result = [];
    try {
      for (let i = 0; i < suppliers.length; i++) {
        let vendor_id = JSON.parse(suppliers[i])[1];
        let vendor_name = JSON.parse(suppliers[i])[0];
        if (req.session.user_id[0] !== vendor_id) {
          try {
            let history = await db.scb.query(aql`FOR po IN orders FILTER po.customer_id == ${req.session.user_id[0]} FILTER po.status == 'closed' FILTER po.vendor_id == ${vendor_id} RETURN po`);
            let orderHistory = await history.all();
            result.push([vendor_name, orderHistory]);
          } catch (err) {
            console.log('inside for loop, i: ', i, err);
          }
        }
      }
      console.log('order history result: ', result);
      let sumTotal = await db.scb.query(aql`
      FOR doc IN orders
      COLLECT group = (doc.vendor_id == 2 ? "Crispy Bakery" : 
                      (doc.vendor_id == 3 ? "Sunny Farm" : 
                      (doc.vendor_id == 4 ?  "Meet Fresh" : "other" )))
      AGGREGATE s = SUM(doc.total)
      RETURN { group, s }
      `)
      let sumTotalRes = await sumTotal.all();
      console.log('sumTotalRes', sumTotalRes);
      res.send({
        orderHistory: result,
        sumByVendors: sumTotalRes,
      })
    } catch (err) {
      console.log('get order history err: ', err);
      res.status(404).send(err);
    }
  } else {
    console.log('req.session.loggedin is false', req.session.loggedin);
  }
});

app.post('/api/orders', async (req, res) => {
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
  } else {
    console.log('req.session.loggedin is false', req.session.loggedin);
  }
});

app.get('/api/partners', async (req, res) => {
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
  } else {
    console.log('req.session.loggedin is false', req.session.loggedin);
  }
})

app.get('/api/user', async (req, res) => {
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
  } else {
    console.log('req.session.loggedin is false', req.session.loggedin);
  }
})

app.post('/auth/login', async (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  try {
    let account = await db.scb.query(aql`FOR d IN accounts FILTER d.username == ${username} AND d.password == ${password} RETURN d`);
    let user = await account.all();
    if (user[0].user_id > 0) {
      req.session.loggedin = true;
      req.session.username = username;
      req.session.user_id = [user[0].user_id];
      res.redirect('/api/home');
    } else {
      res.send('Incorrect Username and/or Password!');
    }
  } catch (err) {
    console.log(err);
    res.status(404).send(err);
  }
})

app.post('/auth/signup', (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;
  res.send('WIP')
});

module.exports = app;