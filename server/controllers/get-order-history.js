const models = require('../models');

module.exports = async (userId, suppliers) => {
  const allOrderHistory = [];
  try {
    for (let i = 0; i < suppliers.length; i += 1) {
      const vendorId = JSON.parse(suppliers[i])[1];
      const vendorName = JSON.parse(suppliers[i])[0];
      if (userId !== vendorId) {
        const orderHistory = await models.orders.getOrderHistoryBySupplierId(userId, vendorId);
        allOrderHistory.push([vendorName, orderHistory]);
      }
    }
    const orderSum = await models.orders.sumOrderHistoryBySupplier();
    return {
      orderHistory: allOrderHistory,
      sumByVendors: orderSum,
    };
  } catch (err) {
    return err;
  }
};
