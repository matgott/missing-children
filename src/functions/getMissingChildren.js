'use strict';
const AWS = require('aws-sdk');
const { Info, Error, Log } = require('../utils/Logging');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  Info('Getting missing children');

  try {
    const { nextKey } = event.pathParameters || { nextKey: null };
    const { Limit } = event.queryStringParameters || { Limit: 5 };

    const ExclusiveStartKey = nextKey
      ? JSON.parse(Buffer.from(nextKey, 'base64').toString('ascii'))
      : undefined;

    const data = await dynamoDb
      .scan({
        TableName: process.env.DYNAMODB_TABLE_MISSING_CHILDREN,
        Limit,
        ExclusiveStartKey,
      })
      .promise();

    const encodedNextKey = data.LastEvaluatedKey
      ? Buffer.from(JSON.stringify(data.LastEvaluatedKey)).toString('base64')
      : undefined;

    const next =
      encodedNextKey &&
      `https://${event.headers.Host}/${event.requestContext.stage}${event.path}/${encodedNextKey}`;

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: data.Items,
        next,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error,
      }),
    };
  }
};
