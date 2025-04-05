const badWords = require('./badwords');

function containsBadWords(text = '') {
  return badWords.some(word => text.toLowerCase().includes(word));
}

function containsLinks(text = '') {
  return /(https?:\/\/[^\s]+)/gi.test(text);
}

module.exports = { containsBadWords, containsLinks };