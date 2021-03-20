'use strict';
const axios = require('axios');

module.exports.Scrapper = async (url) => {
  try {
    const response = await axios({
      method: 'GET',
      url,
    });

    if (!response.status === 200)
      throw new Error(`Request fails with status code: ${response.status}: ${response.statusText}`);

    return response.data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};
