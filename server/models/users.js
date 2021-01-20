const { aql } = require('arangojs/lib');
const crypto = require('crypto');
const db = require('../../database');

const setPassword = (password) => {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt,
    1000, 64, 'sha512').toString('hex');
};

const validPassword = (password) => {
  const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};

const getUserInfo = async (userId) => {
  try {
    const getUser = await db.scb.query(aql`FOR d IN accounts FILTER d.user_id == ${userId} RETURN d`);
    const userInfo = await getUser.all();
    return userInfo;
  } catch (err) {
    return err;
  }
};

const searchUser = async (username, password) => {
  try {
    const account = await db.scb.query(aql`
    FOR d IN accounts FILTER d.username == ${username} AND d.password == ${password} RETURN d
    `);
    const user = await account.all();
    return user;
  } catch (err) {
    return err;
  }
};

module.exports.getUserInfo = getUserInfo;
module.exports.searchUser = searchUser;
module.exports.setPassword = setPassword;
module.exports.validPassword = validPassword;
