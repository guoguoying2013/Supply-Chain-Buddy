Database = require('arangojs').Database;
//    /usr/local/sbin/arangod
const db = new Database({
    auth: { username: "root", password: null },
});
db.useDatabase('supply_chain_buddy');
db.useBasicAuth("root", null);
const PurchaseOrders = db.collection('purchase_orders'); // po_number(index), status, documents, tracking
const Notes = db.collection('notes'); // user_id(foreign key), po_number(index), note
const accounts = db.collection('accounts'); // user_id(index), company_name, username, password(hash with salt), email, customers/suppliers
const Relationship = db.collection('relationship'); // customer(index), supplier(index)

/*
accounts
{
  user_id: 1,
  company_name: 'Forest Food Center',
  username: 'Ying Guo',
  password: 'test',
  email: 'guoguoying2013@gmail.com',
  role: 'customer',
}
*/

module.exports.scb = db;
module.exports.PurchaseOrders = PurchaseOrders;
module.exports.Notes = Notes;
module.exports.Accounts = accounts;
module.exports.Relationship = Relationship;