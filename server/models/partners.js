const { aql } = require('arangojs/lib');
const db = require('../../database');

const getCustomers = async (userId) => {
  try {
    const getCustomersPartners = await db.scb.query(aql`FOR d IN partners FILTER d.vendor_id == ${userId} RETURN d`);
    const customers = await getCustomersPartners.all();
    return customers;
  } catch (err) {
    return err;
  }
};

const getSuppliers = async (userId) => {
  try {
    const getSuppliersPartners = await db.scb.query(aql`FOR d IN partners FILTER d.customer_id  == ${userId} RETURN d`);
    const suppliers = await getSuppliersPartners.all();
    return suppliers;
  } catch (err) {
    return err;
  }
};

module.exports.getSuppliers = getSuppliers;
module.exports.getCustomers = getCustomers;
