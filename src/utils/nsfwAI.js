const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');
const { SIGHTENGINE_USER, SIGHTENGINE_SECRET } = require('../config/config');

// Function to detect NSFW content using Sightengine API
async function detectNSFW(filePath) {
  try {
    const form = new FormData();
    form.append('media', fs.createReadStream(filePath));
    form.append('models', 'nudity,wad,offensive'); // You can add more models if needed
    form.append('api_user', SIGHTENGINE_USER);
    form.append('api_secret', SIGHTENGINE_SECRET);

    const response = await axios.post('https://api.sightengine.com/1.0/check.json', form, {
      headers: form.getHeaders(),
    });

    const result = response.data;

    const isNSFW =
      result?.nudity?.raw > 0.5 ||
      result?.nudity?.partial > 0.5 ||
      result?.weapon?.prob > 0.5 ||
      result?.alcohol?.prob > 0.5 ||
      result?.drugs?.prob > 0.5 ||
      result?.offensive?.prob > 0.5;

    return isNSFW;
  } catch (err) {
    console.error('NSFW detection error:', err.message);
    return false;
  }
}

module.exports = {
  detectNSFW,
};