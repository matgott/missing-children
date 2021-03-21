'use strict';
const axios = require('axios');
const { Info, Error, Log } = require('./Logging');

module.exports.Scrapper = (url) => {
  Info(`Fetching ${url}`);
  return axios({
    method: 'GET',
    url,
  })
    .then((response) => {
      Log(`${url} fetched`);
      return response.data;
    })
    .catch((error) => {
      Error(`Error fetching ${url}: ${error.message}`);
      return null;
    });
};
