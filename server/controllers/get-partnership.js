const models = require('../models');

module.exports = async (userId) => {
  try {
    const customers = await models.partners.getCustomers(userId);
    const suppliers = await models.partners.getSuppliers(userId);
    return {
      customers,
      suppliers,
    };
  } catch (err) {
    return err;
  }
};
