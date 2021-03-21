'use strict';
const AWS = require('aws-sdk');
const { Info, Error, Log } = require('./Logging');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const saveItem = async (item, table) => {
  Info(`Saving item: ${JSON.stringify(item)}`);
  try {
    const params = {
      TableName: table,
      Item: {
        ...item,
        scrapedAt: new Date().toISOString(),
      },
    };

    await dynamoDb.put(params).promise();
    Log(`Item with ID = ${item.id} saved`);
  } catch (error) {
    Error(`Error saving item with ID = ${item.id}: ${JSON.stringify(error)}`);
  }
};

module.exports.SaveToDynamo = async (data, table) => {
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
