Database = require('arangojs').Database;
//    /usr/local/sbin/arangod
const db = new Database({
    auth: { username: "root", password: null },
});
db.useDatabase('supply_chain_buddy');
db.useBasicAuth("root", null);

const Accounts = db.collection('accounts');
// user_id(index), company_name, username, password(hash with salt), email, role: customer/supplier
const Orders = db.collection('orders');
// order_number(index), 
// status(issued, received, released_to_purchasing, material_ready, released_to_production, assembled, shipped, closed)
// documents
// tracking
// order_issue_date, required_shipping_date, 
// customer_id, vendor_id
// level of urgency(normal, important, urgent, when to send out late notice)
const Messages = db.collection('messages');
// order_number(index), writer_name, message, created_date
const Partners = db.collection('partners');
// customer(index), customer_company_name, vendor_id(index), vendor_company_name

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

orders
{
  order_number: 1,
  status: 'released_to_production',
  documents: null,
  tracking: null,
  order_issue_date: 'Sat Dec 26 2020 11:53:50 GMT-0800 (Pacific Standard Time)',
  required_shipping_date: 'Wed Dec 30 2020 11:53:50 GMT-0800 (Pacific Standard Time)',
  customer_id: 1,
  vendor_id: 2,
  urgency_level: 'important',
  total: 2000,
}

messages

*/

module.exports.scb = db;
module.exports.Orders = Orders;
module.exports.Messages = Messages;
module.exports.Accounts = Accounts;
module.exports.Partners = Partners;