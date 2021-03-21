'use strict';
const cheerio = require('cheerio');
const { URL_ROOT } = require('./Constants');
const { Scrapper } = require('./WebScraper');
const { Info, Error, Log } = require('./Logging');

const dataScraper = async (url) => {
  Info(`Scrapping ${url}`);
  try {
    const data = await Scrapper(url);
    url = new URL(url);

    if (!data) return null;

    const $ = cheerio.load(data);

    const name = $('#table7 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)')
      .text()
      .trim();
    const since = $('#table7 > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1)')
      .text()
      .trim();
    const pictureAge = Number(
      $('#table7 > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(2)')
        .text()
        .trim()
        .split(' ')[0]
    );
    const currentAge = Number(
      $('#table7 > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(2)')
        .text()
        .trim()
        .split(' ')[0]
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

    const pictureData = URL_ROOT + picturePath; //picturePath ? await ImageUrlToBase64(URL_ROOT + picturePath) : undefined;

    return {
      id: Number(url.searchParams.get('id')),
      name,
      since,
      pictureAge,
      currentAge,
      birthPlace: birthPlace || '',
      residencePlace,
      pictureUrl: pictureData,
    };
  } catch (error) {
    Error(`Error scrapping Missing Children ${url}: ${JSON.stringify(error)}`);
    return null;
  }
};

module.exports.MissingChildrenParser = async (html) => {
  Info('Parsing Missing Children data');
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
    Error(`Error parsing Missing Children data: ${JSON.stringify(error)}`);
    return null;
  }
};
