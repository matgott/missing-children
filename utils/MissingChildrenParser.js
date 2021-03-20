'use strict';
const cheerio = require('cheerio');
const { URL_ROOT } = require('./constants');

module.exports.MissingChildrenParser = (data) => {
  try {
    const $ = cheerio.load(data);

    const items = $(
      "#centercolumn > div:nth-child(1) > center:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) table a[href*='datos.php']"
    );

    const dataUrls = items
      .map(function () {
        return URL_ROOT + $(this).attr('href');
      })
      .get();

    console.log(dataUrls);
  } catch (error) {
    console.error(error.message);
    return null;
  }
};
