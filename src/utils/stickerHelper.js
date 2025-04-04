const axios = require('axios');

async function addStickerToSet(ctx, userId, name, sticker, emoji) {
  const stickerFileId = sticker.file_id;
  const isAnimated = sticker.is_animated;
  const isVideo = sticker.is_video;

  return ctx.telegram.addStickerToSet(userId, name, {
    png_sticker: stickerFileId,
    emoji
  });
}

async function createNewStickerSet(ctx, userId, name, title, sticker, emoji) {
  const stickerFileId = sticker.file_id;

  return ctx.telegram.createNewStickerSet(userId, name, title, {
    png_sticker: stickerFileId,
    emoji
  });
}

module.exports = {
  addStickerToSet,
  createNewStickerSet
};