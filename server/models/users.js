const { aql } = require('arangojs/lib');
const db = require('../../database');

const getUserInfo = async (userId) => {
  try {
    const getUser = await db.scb.query(aql`FOR d IN accounts FILTER d.user_id == ${userId} RETURN d`);
    const userInfo = await getUser.all();
    return userInfo;
  } catch (err) {
    return err;
  }
};

module.exports.getUserInfo = getUserInfo;
