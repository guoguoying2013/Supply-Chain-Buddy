const getOpenOrders = require('./get-open-orders.js');
const getOpenHistory = require('./get-order-history.js');
const getPartners = require('./get-partnership.js');
const validateLoginInfo = require('./validate-login-info.js');
const cacheTracking = require('./cache-tracking.js');
const getShippingStatus = require('./get-shipping-status.js');

module.exports.getOpenOrders = getOpenOrders;
module.exports.getOpenHistory = getOpenHistory;
module.exports.getPartners = getPartners;
module.exports.validateLoginInfo = validateLoginInfo;
module.exports.cacheTracking = cacheTracking;
module.exports.getShippingStatus = getShippingStatus;
