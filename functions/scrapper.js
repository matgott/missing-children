'use strict';
const { Scrapper } = require('../utils/WebScraper');
const { MissingChildrenParser } = require('../utils/MissingChildrenParser');
const { URL_MISSING_CHILDREN } = require('../utils/constants');

module.exports.handler = async (event) => {
  const url = URL_MISSING_CHILDREN;
  const data = await Scrapper(url);

  if (!data) return;

  MissingChildrenParser(data);

  // return {
  //   statusCode: 200,
  //   body: JSON.stringify(
  //     {
  //       message: 'Go Serverless v1.0! Your function executed successfully!',
  //       input: event,
  //     },
  //     null,
  //     2
  //   ),
  // };
};
