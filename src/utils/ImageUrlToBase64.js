'use strict';
const axios = require('axios');

module.exports.ImageUrlToBase64 = async (url) => {
  if (!url) throw new Error('Invalid image URL');

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });

    if (!response.data) throw new Error('No image data');

    return (
      'data:' +
      response.headers['Content-Type'] +
      ';base64,' +
      Buffer.from(response.data).toString('base64')
    );
  } catch (error) {
    console.error(error.message);
    return undefined;
  }
};
