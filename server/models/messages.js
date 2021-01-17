const { aql } = require('arangojs/lib');
const db = require('../../database');

const getMessages = async (orderNumber) => {
  try {
    const orderMessages = await db.scb.query(aql`FOR m IN messages FILTER m.order_number == ${orderNumber} RETURN m`);
    const messages = await orderMessages.all();
    return messages;
  } catch (err) {
    return err;
  }
};

module.exports.getMessages = getMessages;
