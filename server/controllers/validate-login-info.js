const models = require('../models');

module.exports = async (loginInfo) => {
  const { username, password } = loginInfo;
  const accountInfo = await models.users.searchUser(username);
  return models.users.validPassword(password, accountInfo[0].hash, accountInfo[0].salt);
};
