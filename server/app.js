const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const models = require('./models');
const controllers = require('./controllers');
const sessionSecret = require('../token_login.js');

// salty and hash password.

const app = express();

const isLoginMiddleware = (req, res, next) => {
  if (req.session.loggedin) {
    next();
  } else {
    console.log('Unauthorized, please login');
    res.status(401).send('Unauthorized, please login');
  }
};

app.use(session({
  secret: sessionSecret.sessionSecret,
  rolling: true,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1200000 },
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static(path.resolve(__dirname, '../client/dist')));
app.use('/api', isLoginMiddleware);

app.get('/api/orders', async (req, res) => {
  const userId = Number(req.query.user_id);
  try {
    res.send(await controllers.getOpenOrders(userId));
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get('/api/messages', async (req, res) => {
  const orderNumber = Number(req.query.order_number);
  try {
    res.send(await models.messages.getMessages(orderNumber));
  } catch (err) {
    res.status(404).send(err);
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const newMessage = req.body;
    const response = await models.messages.postMessages(newMessage);
    res.send(response);
  } catch (err) {
    res.status(403).send(err);
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const { suppliers } = req.query;
    const userId = req.session.user_id[0];
    const orderHistory = await controllers.getOpenHistory(userId, suppliers);
    res.send(orderHistory);
  } catch (err) {
    res.send(err);
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const response = await models.orders.postNewOrder(req.body);
    res.send(response);
  } catch (err) {
    res.status(403).send(err);
  }
});

app.get('/api/partners', async (req, res) => {
  try {
    const userId = Number(req.query.user_id);
    res.send(await controllers.getPartners(userId));
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get('/api/user', async (req, res) => {
  const userId = Number(req.query.user_id);
  try {
    res.send(await models.users.getUserInfo(userId));
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get('/api/home', (req, res) => {
  try {
    res.status(200).send(req.session.user_id);
  } catch (err) {
    res.send(err);
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { username } = req.body;
    const { password } = req.body;
    const user = await models.users.searchUser(username, password);
    if (user[0].user_id > 0) {
      req.session.loggedin = true;
      req.session.username = username;
      req.session.user_id = [user[0].user_id];
      res.redirect('/api/home');
    } else {
      res.send('Incorrect Username and/or Password!');
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

app.post('/auth/signup', (req, res) => {
  const { username } = req.body;
  const { password } = req.body;
  res.send('WIP');
});

module.exports = app;
