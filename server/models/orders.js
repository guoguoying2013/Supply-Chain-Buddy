const { aql } = require('arangojs/lib');
const db = require('../../database');

const orders = async (userId) => {
  try {
    const purchaseOrders = await db.scb.query(aql`FOR po IN orders FILTER po.customer_id == ${userId} AND po.status != 'closed' RETURN po`);
    const pos = await purchaseOrders.all();
    const customerOrders = await db.scb.query(aql`FOR co IN orders FILTER co.vendor_id == ${userId} AND co.status != 'closed' RETURN co`);
    const cos = await customerOrders.all();
    return {
      purchase_orders: pos,
      customer_orders: cos,
    };
  } catch (err) {
    return err;
  }
};

module.exports = orders;
