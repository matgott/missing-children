'use strict';
const AWS = require('aws-sdk');
const { Info, Error, Log } = require('./Logging');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const saveItem = (item, table) => {
  Info(`Saving item: ${JSON.stringify(item)}`);
  const params = {
    TableName: table,
    Item: {
      ...item,
      scrapedAt: new Date().toISOString(),
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      Error(`Error saving item with ID = ${item.id}: ${JSON.stringify(error)}`);
    } else {
      Log(`Item with ID = ${item.id} saved`);
    }
  });
};

module.exports.SaveToDynamo = (data, table) => {
  if (data) {
    if (data instanceof Array) {
      for (const item of data) {
        saveItem(item, table);
      }
    } else {
      saveItem(data, table);
    }
  }
};
