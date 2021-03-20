'use strict';
const cheerio = require('cheerio');
const { URL_ROOT } = require('./constants');
const { Scrapper } = require('./WebScraper');
const { ImageUrlToBase64 } = require('./ImageUrlToBase64');

const dataScraper = async (url) => {
  try {
    const data = await Scrapper(url);

    if (!data) return null;

    const $ = cheerio.load(data);

    const name = $('#table7 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)')
      .text()
      .trim();
    const from = $('#table7 > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1)')
      .text()
      .trim();
    const pictureAge = Number(
      $('#table7 > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2)')
        .text()
        .trim()
        .replace(' años', '')
    );
    const currentAge = Number(
      $('#table7 > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(2)')
        .text()
        .trim()
        .replace(' años', '')
    );
    const birthPlace = $(
      '#table7 > tbody:nth-child(1) > tr:nth-child(9) > td:nth-child(1)'
    )?.innerHTML?.trim();
    const residencePlace = $('#table7 > tbody:nth-child(1) > tr:nth-child(12) > td:nth-child(1)')
      .text()
      .trim();
    const picturePath = $(
      '#table5 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > img:nth-child(1)'
    ).attr('src');

    const pictureData = picturePath ? await ImageUrlToBase64(URL_ROOT + picturePath) : undefined;

    return {
      name,
      from,
      pictureAge,
      currentAge,
      birthPlace,
      residencePlace,
      pictureData,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports.MissingChildrenParser = async (html) => {
  try {
    const $ = cheerio.load(html);

    const items = $(
      "#centercolumn > div:nth-child(1) > center:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) table a[href*='datos.php']"
    );

    const promises = items
      .map(function () {
        return dataScraper(URL_ROOT + $(this).attr('href'));
      })
      .get();

    const data = (await Promise.allSettled(promises))
      .filter((result) => result.status === 'fulfilled')
      .map((item) => item.value);

    return data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};
