Database = require('arangojs').Database;

const db = new Database();
db.useDatabase('supply_chain_buddy');
const PurchaseOrders = db.collection('purchase_orders'); // po_number(index), status, documents, tracking
const Notes = db.collection('notes'); // user_id(foreign key), po_number(index), note
const Users = db.collection('users'); // user_id(index), company_name, username, password(hash with salt), email, customers/suppliers
const Relationship = db.collection('relationship'); // customer(index), supplier(index)

module.exports = PurchaseOrders;
module.exports = Notes;
module.exports = Users;
module.exports = Relationship;