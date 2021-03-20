'use strict';
const axios = require('axios');

module.exports.Scrapper = (url) => {
  return axios({
    method: 'GET',
    url,
  })
    .then((response) => response.data)
    .catch((error) => {
      console.error(error.message);
      return null;
    });
};
