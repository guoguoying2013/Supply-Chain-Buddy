const { aql } = require('arangojs/lib');
const crypto = require('crypto');
const db = require('../../database');

const setPassword = (newPassword) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(newPassword, salt,
    1000, 64, 'sha512').toString('hex');
  return { hash, salt };
};

const validPassword = (enteredPassword, userHash, userSalt) => {
  const hash = crypto.pbkdf2Sync(enteredPassword, userSalt, 1000, 64, 'sha512').toString('hex');
  return hash === userHash;
};

const createUserAccount = async (newUserInfo) => {
  let hashSalt = setPassword(newUserInfo.password);
  newUserInfo.hash = hashSalt.hash;
  newUserInfo.salt = hashSalt.salt;
  delete newUserInfo.password;
  db.Accounts.save(newUserInfo)
    .then((doc) => `Account is created, dock._key is ${doc._key}`)
    .catch((err) => err);
};

const getUserInfo = async (userId) => {
  try {
    const getUser = await db.scb.query(aql`
    FOR d IN accounts FILTER d.user_id == ${userId} RETURN d
    `);
    const userInfo = await getUser.all();
    return userInfo;
  } catch (err) {
    return err;
  }
};

const searchUser = async (username) => {
  try {
    const account = await db.scb.query(aql`
    FOR d IN accounts FILTER d.username == ${username} RETURN d
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
module.exports.createUserAccount = createUserAccount;
