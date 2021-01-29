const axios = require('axios');
const APITrackingKey = require('../../token_login.js');

module.exports = async (trackingId) => {
  try {
    const shippingStatus = await axios.get(
      `https://api.aftership.com/v4/trackings?id=${trackingId}`,
      {
        headers: {
          'aftership-api-key': APITrackingKey.APITrackingKey,
          'Content-Type': 'application/json',
        },
      },
    );
    return shippingStatus.data.data.trackings[0].checkpoints;
  } catch (err) {
    return err;
  }
};
