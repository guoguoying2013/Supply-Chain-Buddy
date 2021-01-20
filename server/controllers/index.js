const getOpenOrders = require('./get-open-orders.js');
const getOpenHistory = require('./get-order-history.js');
const getPartners = require('./get-partnership.js');
const validateLoginInfo = require('./validate-login-info.js');

module.exports.getOpenOrders = getOpenOrders;
module.exports.getOpenHistory = getOpenHistory;
module.exports.getPartners = getPartners;
module.exports.validateLoginInfo = validateLoginInfo;
