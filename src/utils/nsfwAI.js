const tf = require('@tensorflow/tfjs-node');
const nsfwjs = require('nsfwjs');
const axios = require('axios');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Load model once
let _model = null;
async function loadModel() {
  if (!_model) {
    _model = await nsfwjs.load();
  }
  return _model;
}

// Download file
async function downloadFile(fileUrl, outputPath) {
  const writer = fs.createWriteStream(outputPath);
  const response = await axios.get(fileUrl, { responseType: 'stream' });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', () => resolve(outputPath));
    writer.on('error', reject);
  });
}

// Check if image is NSFW
async function classifyImage(filePath) {
  const image = await sharp(filePath)
    .resize({ width: 299, height: 299 })
    .toBuffer();

  const tfimage = tf.node.decodeImage(image, 3);
  const model = await loadModel();
  const predictions = await model.classify(tfimage);
  tfimage.dispose();

  const nsfwTypes = ['Porn', 'Hentai', 'Sexy'];
  return predictions.some(pred => nsfwTypes.includes(pred.className) && pred.probability > 0.8);
}

// Telegram File API Helper
async function getTelegramFileUrl(fileId, botToken) {
  const resp = await axios.get(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
  const filePath = resp.data.result.file_path;
  return `https://api.telegram.org/file/bot${botToken}/${filePath}`;
}

// Check sticker (webp)
async function isNSFWSticker(sticker, botToken = process.env.BOT_TOKEN) {
  try {
    const url = await getTelegramFileUrl(sticker.file_id, botToken);
    const tempPath = path.join(__dirname, '../../temp/sticker.webp');
    await downloadFile(url, tempPath);
    const isNSFW = await classifyImage(tempPath);
    fs.unlinkSync(tempPath);
    return isNSFW;
  } catch (err) {
    console.error('isNSFWSticker error:', err);
    return false;
  }
}

// Extract frame from animated or video sticker
async function extractVideoFrameNSFW(fileId, botToken = process.env.BOT_TOKEN) {
  try {
    const url = await getTelegramFileUrl(fileId, botToken);
    const videoPath = path.join(__dirname, '../../temp/video.webm');
    const framePath = path.join(__dirname, '../../temp/frame.jpg');

    await downloadFile(url, videoPath);

    await new Promise((resolve, reject) => {
      exec(`ffmpeg -i ${videoPath} -ss 00:00:01 -frames:v 1 ${framePath}`, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    const isNSFW = await classifyImage(framePath);

    fs.unlinkSync(videoPath);
    fs.unlinkSync(framePath);

    return isNSFW;
  } catch (err) {
    console.error('extractVideoFrameNSFW error:', err);
    return false;
  }
}

module.exports = {
  isNSFWSticker,
  extractVideoFrameNSFW
};