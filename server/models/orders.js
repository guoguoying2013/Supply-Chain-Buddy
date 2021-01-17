const { aql } = require('arangojs/lib');
const db = require('../../database');

const getCustomerOrders = async (userId) => {
  try {
    const customerOrders = await db.scb.query(aql`FOR co IN orders FILTER co.vendor_id == ${userId} AND co.status != 'closed' RETURN co`);
    const cos = await customerOrders.all();
    return cos;
  } catch (err) {
    return err;
  }
};

const getPurchaseOrders = async (userId) => {
  try {
    const purchaseOrders = await db.scb.query(aql`FOR po IN orders FILTER po.customer_id == ${userId} AND po.status != 'closed' RETURN po`);
    const pos = await purchaseOrders.all();
    return pos;
  } catch (err) {
    return err;
  }
};

module.exports.getCustomerOrders = getCustomerOrders;
module.exports.getPurchaseOrders = getPurchaseOrders;
