'use strict';
const { Scrapper } = require('../utils/WebScraper');
const { MissingChildrenParser } = require('../utils/MissingChildrenParser');
const { URL_MISSING_CHILDREN } = require('../utils/Constants');
const { SaveToDynamo } = require('../utils/SaveToDynamo');
const { Info } = require('../utils/Logging');

module.exports.handler = async (event) => {
  Info('Scrapping started');
  process.on('exit', () => Info('Scrapping finish'));
  const url = URL_MISSING_CHILDREN;
  const html = await Scrapper(url);

  if (!html) return;

  const data = await MissingChildrenParser(html);

  SaveToDynamo(data, process.env.DYNAMODB_TABLE_MISSING_CHILDREN);
};
