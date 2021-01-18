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

const postMessages = (newMessage) => {
  db.Messages.save(newMessage)
    .then(
      (doc) => doc._key)
    .catch(
      (err) => err.message,
    );
};

module.exports.getMessages = getMessages;
module.exports.postMessages = postMessages;
