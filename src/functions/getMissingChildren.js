'use strict';
const AWS = require('aws-sdk');
const { Info, Error, Log } = require('../utils/Logging');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  Info('Getting missing children');

  try {
    const { nextKey } = event.pathParameters || { nextKey: null };

    const paginationData = nextKey
      ? JSON.parse(Buffer.from(nextKey, 'base64').toString('ascii'))
      : undefined;

    const ExclusiveStartKey = paginationData?.lastKey || undefined;
    const encodedLimit = paginationData?.limit || 5;

    const { limit } = event.queryStringParameters || { limit: encodedLimit };

    const data = await dynamoDb
      .scan({
        TableName: process.env.DYNAMODB_TABLE_MISSING_CHILDREN,
        Limit: limit,
        ExclusiveStartKey,
      })
      .promise();

    const encodedNextKey = data.LastEvaluatedKey
      ? Buffer.from(JSON.stringify({ lastKey: data.LastEvaluatedKey, limit })).toString('base64')
      : undefined;

    const next =
      encodedNextKey && `https://${event.headers.host}/getMissingChildren/${encodedNextKey}`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: data.Items,
        next,
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};
