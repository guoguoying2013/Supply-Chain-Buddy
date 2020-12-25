Database = require('arangojs').Database;

const db = new Database();
db.useDatabase('supply_chain_buddy');
const purchaseOrderCollection= db.collection('purchase_order_collection');

module.exports = purchaseOrderCollection;