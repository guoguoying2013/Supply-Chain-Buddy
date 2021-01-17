const models = require('../models');

module.exports = async (userId) => {
  const openCustomerOrders = await models.orders.getCustomerOrders(userId);
  const openPurchaseOrders = await models.orders.getPurchaseOrders(userId);
  return {
    customer_orders: openCustomerOrders,
    purchase_orders: openPurchaseOrders,
  };
};
