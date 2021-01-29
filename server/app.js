const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const models = require('./models');
const controllers = require('./controllers');
const sessionSecret = require('../token_login.js');
const middleware = require('./middleware');

const app = express();

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
app.use('/api', middleware.isLogin);

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

app.get('/api/tracking', controllers.cacheTracking.checkCache, async (req, res) => {
  try {
    const { id } = req.query;
    console.log('id: ', id);
    const response = await controllers.getShippingStatus(id);
    controllers.cacheTracking.cacheInfo(id, response);
    return res.send(response);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const isValid = controllers.validateLoginInfo(req.body);
    if (isValid) {
      req.session.loggedin = true;
      req.session.username = req.body.username;
      req.session.user_id = [1];
      res.redirect('/api/home');
    }
  } catch (err) {
    res.status(404).send(err);
  }
});

app.post('/auth/signup', async (req, res) => {
  const newUserInfo = req.body;
  try {
    const response = await models.users.createUserAccount(newUserInfo);
    res.send(response);
  } catch (err) {
    res.send(err);
  }
});

module.exports = app;
