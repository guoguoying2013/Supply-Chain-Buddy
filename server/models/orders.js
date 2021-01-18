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

const getOrderHistoryBySupplierId = async (userId, supplierId) => {
  try {
    const getHistory = await db.scb.query(aql`FOR po IN orders FILTER po.customer_id == ${userId} FILTER po.status == 'closed' FILTER po.vendor_id == ${supplierId} RETURN po`);
    const orderHistory = await getHistory.all();
    return orderHistory;
  } catch (err) {
    return err;
  }
};

const sumOrderHistoryBySupplier = async () => {
  try {
    const getSumTotal = await db.scb.query(aql`
    FOR doc IN orders
    COLLECT group = (doc.vendor_id == 2 ? "Crispy Bakery" : 
                    (doc.vendor_id == 3 ? "Sunny Farm" : 
                    (doc.vendor_id == 4 ?  "Meet Fresh" : "other" )))
    AGGREGATE s = SUM(doc.total)
    RETURN { group, s }
    `);
    const sumTotal = await getSumTotal.all();
    return sumTotal;
  } catch (err) {
    return err;
  }
};

module.exports.getCustomerOrders = getCustomerOrders;
module.exports.getPurchaseOrders = getPurchaseOrders;
module.exports.getOrderHistoryBySupplierId = getOrderHistoryBySupplierId;
module.exports.sumOrderHistoryBySupplier = sumOrderHistoryBySupplier;
