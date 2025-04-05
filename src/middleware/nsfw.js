const axios = require('axios');
const { SIGHTENGINE_USER, SIGHTENGINE_SECRET } = require('../config/config');
const fs = require('fs');
const path = require('path');
const { downloadMedia, autoDelete } = require('../utils/helpers');

// Middleware to detect NSFW using Sightengine
async function nsfwMiddleware(ctx, next) {
  try {
    const message = ctx.message;
    const file = message.photo?.slice(-1)[0] || message.sticker || message.document || message.video;

    if (!file) return next();

    const filePath = await downloadMedia(ctx, file);
    if (!filePath) return next();

    const formData = new FormData();
    formData.append('media', fs.createReadStream(filePath));
    formData.append('models', 'nudity,wad,offensive');
    formData.append('api_user', SIGHTENGINE_USER);
    formData.append('api_secret', SIGHTENGINE_SECRET);

    const response = await axios.post('https://api.sightengine.com/1.0/check.json', formData, {
      headers: formData.getHeaders(),
    });

    fs.unlink(filePath, () => {}); // delete after use

    const result = response.data;
    const { nudity, offensive, weapon, alcohol, drugs } = result;

    const nsfwScore = nudity?.raw || 0;
    const isNSFW = nsfwScore > 0.5 || offensive?.prob > 0.5 || weapon?.prob > 0.5 || alcohol?.prob > 0.5 || drugs?.prob > 0.5;

    if (isNSFW) {
      await ctx.deleteMessage();
      return ctx.reply('NSFW content detected and removed by AI.');
    }

    await next();
  } catch (err) {
    console.error('NSFW Middleware Error:', err.message);
    await next();
  }
}

module.exports = nsfwMiddleware;